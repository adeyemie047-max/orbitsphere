"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import type { UserRole } from "@prisma/client";
import type { DashboardArticleRow } from "@/lib/dashboard-data";
import { getArticleActions } from "@/lib/rbac";
import Badge, { resolveCategoryColor } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  published: "bg-[rgba(34,197,94,0.12)] text-live border-[rgba(34,197,94,0.25)]",
  draft: "bg-white/6 text-text-muted border-white/10",
  scheduled: "bg-[rgba(59,130,246,0.12)] text-electric border-[rgba(59,130,246,0.25)]",
  archived: "bg-white/6 text-text-muted border-white/10",
};

interface ArticleManagerTableProps {
  articles: DashboardArticleRow[];
  userRole: UserRole;
  userId: string;
  title?: string;
  compact?: boolean;
}

export default function ArticleManagerTable({
  articles: initialArticles,
  userRole,
  userId,
  title = "Articles",
  compact = false,
}: ArticleManagerTableProps) {
  const router = useRouter();
  const [articles, setArticles] = useState(initialArticles);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "publishedAt", desc: true },
  ]);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const runAction = useCallback(
    async (id: string, action: "publish" | "archive" | "delete") => {
      setPendingId(id);
      try {
        if (action === "delete") {
          const res = await fetch(`/api/v1/admin/articles/${id}`, {
            method: "DELETE",
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            alert(err.error ?? "Delete failed");
            return;
          }
          setArticles((prev) => prev.filter((a) => a.id !== id));
        } else {
          const status = action === "publish" ? "published" : "archived";
          const res = await fetch(`/api/v1/admin/articles/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            alert(err.error ?? "Update failed");
            return;
          }
          const { data } = await res.json();
          setArticles((prev) =>
            prev.map((a) =>
              a.id === id
                ? {
                    ...a,
                    status: data.status,
                    publishedAt: data.publishedAt,
                  }
                : a
            )
          );
        }
        router.refresh();
      } finally {
        setPendingId(null);
      }
    },
    [router]
  );

  const columns = useMemo<ColumnDef<DashboardArticleRow>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <Link
            href={
              row.original.status === "published"
                ? `/article/${row.original.slug}`
                : `/dashboard/write?edit=${row.original.id}`
            }
            className="font-[family-name:var(--font-ui)] text-[13px] font-semibold text-text-primary hover:text-gold line-clamp-1 max-w-xs block"
          >
            {row.original.title}
          </Link>
        ),
      },
      {
        accessorKey: "authorName",
        header: "Author",
        cell: ({ getValue }) => (
          <span className="font-[family-name:var(--font-ui)] text-[13px] text-text-secondary">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "categoryName",
        header: "Category",
        cell: ({ row }) => (
          <Badge variant={resolveCategoryColor(row.original.categoryColor)} className="text-[10px]">
            {row.original.categoryName}
          </Badge>
        ),
        filterFn: "includesString",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return (
            <span
              className={cn(
                "font-[family-name:var(--font-ui)] text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border",
                statusStyles[status] ?? statusStyles.draft
              )}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: "viewsCount",
        header: "Views",
        cell: ({ getValue }) => (
          <span className="font-[family-name:var(--font-ui)] text-[13px] text-text-secondary">
            {(getValue<number>() ?? 0) > 0
              ? getValue<number>().toLocaleString()
              : "—"}
          </span>
        ),
      },
      {
        accessorKey: "publishedAt",
        header: "Date",
        cell: ({ row }) => (
          <span className="font-[family-name:var(--font-ui)] text-[13px] text-text-secondary whitespace-nowrap">
            {row.original.status === "draft"
              ? "—"
              : formatDate(row.original.publishedAt ?? row.original.updatedAt)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => {
          const actions = getArticleActions(
            userRole,
            userId,
            row.original.authorId,
            row.original.status
          );
          const busy = pendingId === row.original.id;

          return (
            <div className="flex flex-wrap gap-1.5">
              {actions.includes("view") && (
                <Link
                  href={`/article/${row.original.slug}`}
                  className="font-[family-name:var(--font-ui)] text-[11px] font-semibold px-3 py-1.5 rounded-md bg-white/5 border border-white/6 text-text-secondary hover:bg-[rgba(59,130,246,0.1)] hover:text-electric hover:border-[rgba(59,130,246,0.2)] transition-all"
                >
                  View
                </Link>
              )}
              {actions.includes("edit") && (
                <Link
                  href={`/dashboard/write?edit=${row.original.id}`}
                  className="font-[family-name:var(--font-ui)] text-[11px] font-semibold px-3 py-1.5 rounded-md bg-white/5 border border-white/6 text-text-secondary hover:bg-[rgba(212,175,55,0.1)] hover:text-gold hover:border-[rgba(212,175,55,0.2)] transition-all"
                >
                  Edit
                </Link>
              )}
              {actions.includes("publish") && (
                <button
                  disabled={busy}
                  onClick={() => runAction(row.original.id, "publish")}
                  className="font-[family-name:var(--font-ui)] text-[11px] font-semibold px-3 py-1.5 rounded-md bg-white/5 border border-white/6 text-text-secondary cursor-pointer hover:bg-[rgba(34,197,94,0.1)] hover:text-live hover:border-[rgba(34,197,94,0.2)] transition-all disabled:opacity-50"
                >
                  Publish
                </button>
              )}
              {actions.includes("archive") && (
                <button
                  disabled={busy}
                  onClick={() => runAction(row.original.id, "archive")}
                  className="font-[family-name:var(--font-ui)] text-[11px] font-semibold px-3 py-1.5 rounded-md bg-white/5 border border-white/6 text-text-secondary cursor-pointer hover:bg-white/10 transition-all disabled:opacity-50"
                >
                  Archive
                </button>
              )}
              {actions.includes("delete") && (
                <button
                  disabled={busy}
                  onClick={() => {
                    if (confirm("Delete this article permanently?")) {
                      runAction(row.original.id, "delete");
                    }
                  }}
                  className="font-[family-name:var(--font-ui)] text-[11px] font-semibold px-3 py-1.5 rounded-md bg-white/5 border border-white/6 text-text-secondary cursor-pointer hover:bg-[rgba(239,68,68,0.1)] hover:text-breaking hover:border-[rgba(239,68,68,0.2)] transition-all disabled:opacity-50"
                >
                  Delete
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [userRole, userId, pendingId, runAction]
  );

  const table = useReactTable({
    data: articles,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: compact ? 5 : 10 } },
  });

  return (
    <div className="bg-surface border border-white/6 rounded-[14px] overflow-hidden">
      <div className="px-6 py-5 border-b border-white/6 flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-[family-name:var(--font-serif)] text-xl font-bold text-white">
          {title}
        </h3>
        <input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search articles…"
          className="bg-white/5 border border-white/6 rounded-lg px-3.5 py-2 text-text-secondary font-[family-name:var(--font-ui)] text-[13px] outline-none w-full sm:w-56 focus:border-[rgba(212,175,55,0.3)]"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[800px]">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-white/[0.02] border-b border-white/6"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={cn(
                      "font-[family-name:var(--font-ui)] text-[11px] font-bold tracking-widest uppercase text-text-muted px-5 py-3.5 text-left",
                      header.column.getCanSort() && "cursor-pointer select-none hover:text-white"
                    )}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === "asc" && " ↑"}
                    {header.column.getIsSorted() === "desc" && " ↓"}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center font-[family-name:var(--font-ui)] text-sm text-text-muted"
                >
                  No articles found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-3.5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!compact && table.getPageCount() > 1 && (
        <div className="px-6 py-4 border-t border-white/6 flex items-center justify-between gap-4">
          <span className="font-[family-name:var(--font-ui)] text-xs text-text-muted">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} ·{" "}
            {table.getFilteredRowModel().rows.length} articles
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="font-[family-name:var(--font-ui)] text-xs font-semibold px-3 py-1.5 rounded-md bg-white/5 border border-white/6 text-text-secondary disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="font-[family-name:var(--font-ui)] text-xs font-semibold px-3 py-1.5 rounded-md bg-white/5 border border-white/6 text-text-secondary disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

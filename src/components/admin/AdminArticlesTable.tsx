"use client";

import { useState } from "react";
import Link from "next/link";
import type { Article } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

interface AdminArticlesTableProps {
  articles: Article[];
}

const statusStyles = {
  published: "bg-[rgba(34,197,94,0.12)] text-live border-[rgba(34,197,94,0.25)]",
  draft: "bg-white/6 text-text-muted border-white/10",
  scheduled: "bg-[rgba(59,130,246,0.12)] text-electric border-[rgba(59,130,246,0.25)]",
  archived: "bg-white/6 text-text-muted border-white/10",
};

export default function AdminArticlesTable({ articles }: AdminArticlesTableProps) {
  const [query, setQuery] = useState("");

  const filtered = articles.filter(
    (a) =>
      !query.trim() ||
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.author.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-surface border border-white/6 rounded-[14px] overflow-hidden">
      <div className="px-6 py-5 border-b border-white/6 flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-[family-name:var(--font-serif)] text-xl font-bold text-white">
          Recent Articles
        </h3>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍  Search articles…"
          className="bg-white/5 border border-white/6 rounded-lg px-3.5 py-2 text-text-secondary font-[family-name:var(--font-ui)] text-[13px] outline-none w-full sm:w-56 focus:border-[rgba(212,175,55,0.3)]"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/6">
              {["Title", "Author", "Category", "Status", "Views", "Date", "Actions"].map(
                (col) => (
                  <th
                    key={col}
                    className="font-[family-name:var(--font-ui)] text-[11px] font-bold tracking-widest uppercase text-text-muted px-5 py-3.5 text-left"
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((article) => (
              <tr
                key={article.id}
                className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-5 py-3.5">
                  <Link
                    href={`/article/${article.slug}`}
                    className="font-[family-name:var(--font-ui)] text-[13px] font-semibold text-text-primary hover:text-gold line-clamp-1 max-w-xs"
                  >
                    {article.title}
                  </Link>
                </td>
                <td className="px-5 py-3.5 font-[family-name:var(--font-ui)] text-[13px] text-text-secondary">
                  {article.author.name}
                </td>
                <td className="px-5 py-3.5">
                  <Badge variant={article.category.color} className="text-[10px]">
                    {article.category.name}
                  </Badge>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`font-[family-name:var(--font-ui)] text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border ${statusStyles[article.status]}`}
                  >
                    {article.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 font-[family-name:var(--font-ui)] text-[13px] text-text-secondary">
                  {article.viewsCount > 0 ? article.viewsCount.toLocaleString() : "—"}
                </td>
                <td className="px-5 py-3.5 font-[family-name:var(--font-ui)] text-[13px] text-text-secondary whitespace-nowrap">
                  {article.status === "draft" ? "—" : formatDate(article.publishedAt)}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-2">
                    <button className="font-[family-name:var(--font-ui)] text-[11px] font-semibold px-3 py-1.5 rounded-md bg-white/5 border border-white/6 text-text-secondary cursor-pointer hover:bg-[rgba(212,175,55,0.1)] hover:text-gold hover:border-[rgba(212,175,55,0.2)] transition-all">
                      Edit
                    </button>
                    <button className="font-[family-name:var(--font-ui)] text-[11px] font-semibold px-3 py-1.5 rounded-md bg-white/5 border border-white/6 text-text-secondary cursor-pointer hover:bg-[rgba(239,68,68,0.1)] hover:text-breaking hover:border-[rgba(239,68,68,0.2)] transition-all">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

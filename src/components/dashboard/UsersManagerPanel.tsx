"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { cn } from "@/lib/utils";

type UserRow = {
  id: string;
  email: string;
  fullName: string | null;
  username: string | null;
  role: string;
  isVerified: boolean;
  createdAt: string;
  articleCount: number;
  commentCount: number;
};

const ROLES = [
  { value: "", label: "All roles" },
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "journalist", label: "Journalist" },
  { value: "reader", label: "Reader" },
] as const;

const ASSIGNABLE = ["admin", "editor", "journalist", "reader"] as const;

export default function UsersManagerPanel() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: "",
    fullName: "",
    username: "",
    role: "journalist",
  });
  const [inviteStatus, setInviteStatus] = useState<string | null>(null);
  const [inviting, setInviting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      limit: String(limit),
      page: String(page),
    });
    if (query.trim()) params.set("q", query.trim());
    if (roleFilter) params.set("role", roleFilter);
    const res = await fetch(`/api/v1/admin/users?${params}`);
    if (res.ok) {
      const json = await res.json();
      setUsers(json.data ?? []);
      setTotal(json.total ?? 0);
    }
    setLoading(false);
  }, [query, roleFilter, page, limit]);

  useEffect(() => {
    setPage(1);
  }, [query, roleFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const changeRole = async (userId: string, role: string) => {
    setUpdatingId(userId);
    const res = await fetch(`/api/v1/admin/users/${userId}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      await fetchUsers();
    } else {
      const json = await res.json();
      alert(json.error ?? "Role update failed");
    }
    setUpdatingId(null);
  };

  const sendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    setInviteStatus(null);
    const res = await fetch("/api/v1/admin/users/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inviteForm),
    });
    const json = await res.json();
    if (res.ok) {
      setInviteStatus(json.message ?? "Invite sent.");
      setInviteForm({ email: "", fullName: "", username: "", role: "journalist" });
      setInviteOpen(false);
      await fetchUsers();
    } else {
      setInviteStatus(json.error ?? "Invite failed");
    }
    setInviting(false);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-3 flex-1">
          <Input
            placeholder="Search by name, email, or username…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-xs"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white/5 border border-white/6 rounded-lg px-3 py-2 text-text-primary text-sm outline-none focus:border-[rgba(212,175,55,0.3)]"
          >
            {ROLES.map((r) => (
              <option key={r.value || "all"} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <Button size="sm" onClick={() => setInviteOpen((v) => !v)}>
          {inviteOpen ? "Cancel invite" : "+ Invite staff"}
        </Button>
      </div>

      {inviteStatus && (
        <p className="mb-4 text-sm text-text-secondary">{inviteStatus}</p>
      )}

      {inviteOpen && (
        <form
          onSubmit={sendInvite}
          className="mb-6 p-5 bg-surface border border-white/6 rounded-[14px] grid gap-4 sm:grid-cols-2"
        >
          <Input
            label="Email"
            type="email"
            required
            value={inviteForm.email}
            onChange={(e) => setInviteForm((f) => ({ ...f, email: e.target.value }))}
          />
          <Input
            label="Full name"
            required
            value={inviteForm.fullName}
            onChange={(e) => setInviteForm((f) => ({ ...f, fullName: e.target.value }))}
          />
          <Input
            label="Username"
            required
            pattern="[a-z0-9_]{3,100}"
            title="Lowercase letters, numbers, underscores only"
            value={inviteForm.username}
            onChange={(e) =>
              setInviteForm((f) => ({ ...f, username: e.target.value.toLowerCase() }))
            }
          />
          <label className="font-[family-name:var(--font-ui)] text-xs text-text-muted">
            Role
            <select
              value={inviteForm.role}
              onChange={(e) => setInviteForm((f) => ({ ...f, role: e.target.value }))}
              className="mt-1 w-full bg-white/5 border border-white/6 rounded-lg px-3 py-2 text-text-primary text-sm outline-none"
            >
              {ASSIGNABLE.filter((r) => r !== "reader").map((r) => (
                <option key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={inviting}>
              {inviting ? "Sending…" : "Send invite email"}
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-text-muted text-sm">Loading users…</p>
      ) : users.length === 0 ? (
        <div className="p-8 bg-surface border border-white/6 rounded-[14px] text-center">
          <p className="text-text-secondary text-sm">No users match your search.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[14px] border border-white/6">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.03] font-[family-name:var(--font-ui)] text-[10px] uppercase tracking-wider text-text-muted">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Activity</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6">
              {users.map((user) => (
                <tr key={user.id} className="bg-surface hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white">
                      {user.fullName ?? user.email}
                    </div>
                    <div className="text-xs text-text-muted">
                      {user.email}
                      {user.username ? ` · @${user.username}` : ""}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      disabled={updatingId === user.id}
                      onChange={(e) => void changeRole(user.id, e.target.value)}
                      className={cn(
                        "bg-white/5 border border-white/6 rounded-lg px-2 py-1.5 text-xs capitalize outline-none",
                        updatingId === user.id && "opacity-50"
                      )}
                    >
                      {ASSIGNABLE.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-text-muted text-xs">
                    {user.articleCount} articles · {user.commentCount} comments
                  </td>
                  <td className="px-4 py-3 text-text-muted text-xs whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString("en-NG")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && total > limit && (
        <div className="flex items-center justify-between mt-4 text-sm text-text-muted">
          <span>
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

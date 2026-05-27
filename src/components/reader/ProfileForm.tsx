"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

type Profile = {
  id: string;
  fullName: string | null;
  email: string;
  bio: string | null;
  avatarUrl: string | null;
};

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [fullName, setFullName] = useState(profile.fullName ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    const res = await fetch("/api/v1/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        bio: bio || null,
        avatarUrl: avatarUrl || null,
      }),
    });
    setStatus(res.ok ? "saved" : "error");
  };

  return (
    <form
      onSubmit={save}
      className="bg-surface border border-border rounded-[14px] p-6 mb-6 space-y-4"
    >
      <h2 className="font-serif text-lg font-bold text-foreground">Account</h2>
      <p className="font-ui text-xs text-text-muted">{profile.email}</p>
      <label className="font-ui text-xs text-text-muted block">
        Display name
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-1 w-full field-input resize-y"
        />
      </label>
      <label className="font-ui text-xs text-text-muted block">
        Bio
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="mt-1 w-full field-textarea"
        />
      </label>
      <label className="font-ui text-xs text-text-muted block">
        Avatar URL
        <input
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          type="url"
          className="mt-1 w-full field-input resize-y"
        />
      </label>
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : "Save profile"}
        </Button>
        {status === "saved" && (
          <span className="text-live text-xs font-ui">Saved</span>
        )}
        {status === "error" && (
          <span className="text-breaking text-xs font-ui">Save failed</span>
        )}
      </div>
    </form>
  );
}

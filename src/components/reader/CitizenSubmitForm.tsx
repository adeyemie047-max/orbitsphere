"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function CitizenSubmitForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/v1/citizen/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submitterName: data.get("submitterName"),
          email: data.get("email"),
          title: data.get("title"),
          body: data.get("body"),
          mediaUrl: data.get("mediaUrl") || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(json.error ?? "Submission failed");
        return;
      }
      setStatus("success");
      setMessage(json.message ?? "Story submitted!");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-surface border border-[rgba(34,197,94,0.25)] rounded-[14px] p-8 text-center">
        <p className="text-live font-ui text-sm">{message}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-gold text-sm hover:underline cursor-pointer bg-transparent border-none"
        >
          Submit another story
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface border border-border rounded-[14px] p-6 lg:p-8 space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="font-ui text-xs text-text-muted block">
          Your name
          <input
            name="submitterName"
            required
            className="mt-1 w-full field-input"
          />
        </label>
        <label className="font-ui text-xs text-text-muted block">
          Email
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full field-input"
          />
        </label>
      </div>
      <label className="font-ui text-xs text-text-muted block">
        Story headline
        <input
          name="title"
          required
          maxLength={500}
          className="mt-1 w-full field-input"
        />
      </label>
      <label className="font-ui text-xs text-text-muted block">
        Your story
        <textarea
          name="body"
          required
          minLength={20}
          rows={8}
          className="mt-1 w-full field-textarea"
        />
      </label>
      <label className="font-ui text-xs text-text-muted block">
        Media URL (optional)
        <input
          name="mediaUrl"
          type="url"
          placeholder="https://…"
          className="mt-1 w-full field-input"
        />
      </label>
      {status === "error" && (
        <p className="text-breaking text-sm font-ui">{message}</p>
      )}
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Submitting…" : "Submit for review"}
      </Button>
    </form>
  );
}

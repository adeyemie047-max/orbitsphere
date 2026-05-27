"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export default function PushNotificationPrompt() {
  const { status } = useSession();
  const [supported, setSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSupported(
      typeof window !== "undefined" &&
        "serviceWorker" in navigator &&
        "PushManager" in window
    );
  }, []);

  const subscribe = useCallback(async () => {
    if (status !== "authenticated") return;
    setLoading(true);
    try {
      const keyRes = await fetch("/api/v1/push/vapid-public-key");
      if (!keyRes.ok) return;
      const { publicKey } = await keyRes.json();

      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const json = sub.toJSON();
      await fetch("/api/v1/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: json.endpoint,
          keys: json.keys,
        }),
      });
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  }, [status]);

  if (!supported || status !== "authenticated" || subscribed) return null;

  return (
    <div className="bg-surface border border-border rounded-[14px] p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
      <p className="font-[family-name:var(--font-ui)] text-sm text-text-secondary">
        Get breaking news alerts on this device
      </p>
      <Button size="sm" onClick={() => void subscribe()} disabled={loading}>
        {loading ? "Enabling…" : "Enable notifications"}
      </Button>
    </div>
  );
}

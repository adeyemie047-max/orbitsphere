import { Suspense } from "react";
import PremiumVerifyClient from "@/components/premium/PremiumVerifyClient";

export const metadata = {
  title: "Confirm Premium Payment",
};

export default function PremiumVerifyPage() {
  return (
    <div className="container-main py-16 sm:py-24">
      <Suspense
        fallback={
          <div className="editorial-card p-10 text-center max-w-lg mx-auto animate-pulse h-48" />
        }
      >
        <PremiumVerifyClient />
      </Suspense>
    </div>
  );
}

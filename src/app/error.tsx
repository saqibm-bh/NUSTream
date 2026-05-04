"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error("Global boundary caught an error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-nust-offwhite dark:bg-nust-dark text-slate-900 dark:text-slate-100 p-6">
      <div className="glass-panel text-center max-w-md w-full p-10 rounded-3xl shadow-2xl space-y-6 flex flex-col items-center border border-white/20 dark:border-white/10 dark:bg-nust-dark/50 bg-white/70 backdrop-blur-xl">
        <div className="bg-red-100 p-4 rounded-full">
            <AlertTriangle className="w-16 h-16 text-red-600 dark:text-red-500" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Something went wrong
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          We encountered an unexpected error. Please try again.
        </p>
        <Button
          onClick={() => reset()}
          className="w-full mt-4 bg-[#003366] hover:bg-[#002244] text-white"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
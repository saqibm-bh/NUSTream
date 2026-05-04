"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import ThemeToggleButton from "@/components/ThemeToggleButton";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-nust-offwhite dark:bg-nust-dark text-slate-900 dark:text-slate-100 p-6">
      <ThemeToggleButton className="fixed right-5 top-5 z-50" />
      <div className="glass-panel text-center max-w-md w-full p-10 rounded-3xl shadow-2xl space-y-6 flex flex-col items-center border border-white/20 dark:border-white/10 dark:bg-nust-dark/50 bg-white/70 backdrop-blur-xl">
        <div className="bg-[#003366]/10 p-4 rounded-full">
            <ShieldAlert className="w-16 h-16 text-[#003366] dark:text-blue-300" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-[#003366] dark:text-blue-300">
          Session not found
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          The meeting room or page you are looking for does not exist or has been removed.
        </p>
        <Button asChild className="w-full mt-4 bg-[#003366] hover:bg-[#002244] text-white">
          <Link href="/">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}

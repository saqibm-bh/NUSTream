import Link from "next/link";
import ThemeToggleButton from "@/components/ThemeToggleButton";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-nust-offwhite px-6 py-12 text-slate-900 transition-colors duration-500 dark:bg-nust-dark dark:text-slate-100">
      <ThemeToggleButton className="fixed right-5 top-5 z-50" />
      <section className="glass-panel w-full max-w-2xl rounded-[1.5rem] p-8 md:p-10">
        <div className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">
          Access Restricted
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-nust-blue dark:text-blue-300 md:text-4xl">
          Unauthorized Sign-In
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
          NUSTream is available only to official NUST students and faculty.
          Please sign in using your institutional email ending with{" "}
          <span className="font-semibold">@nust.edu.pk</span> or{" "}
          <span className="font-semibold">@seecs.edu.pk</span>.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/user-auth"
            className="inline-flex items-center justify-center rounded-[1.15rem] bg-nust-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-nust-dark active:scale-[0.98]"
          >
            Back to Sign In
          </Link>
        </div>
      </section>
    </main>
  );
}


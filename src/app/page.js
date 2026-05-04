"use client";

import Image from "next/image";
import { GraduationCap, Shield, Video } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import MeetingAction from "./components/MeetingAction";
import MeetingFeature from "./components/MeetingFeature";
import { Button } from "@/components/ui/button";
import ThemeToggleButton from "@/components/ThemeToggleButton";

const FEATURE_ITEMS = [
  {
    icon: Shield,
    title: "Domain-Restricted Access",
    description: "Only verified NUST and SEECS institutional accounts can enter.",
  },
  {
    icon: Video,
    title: "HD Academic Streaming",
    description: "Reliable lectures, viva sessions, and collaboration in high clarity.",
  },
  {
    icon: GraduationCap,
    title: "Campus-Grade Collaboration",
    description: "Built for faculty, students, and societies across the virtual campus.",
  },
];

const UPCOMING_LECTURES = [
  { time: "09:00", title: "Digital Signal Processing", venue: "SEECS Block A" },
  { time: "11:00", title: "Software Design Studio", venue: "Remote Lab Room" },
  { time: "14:30", title: "AI for Engineers", venue: "NUST Virtual Campus" },
];

export default function Home() {
  const { status, data: session } = useSession();
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") {
      setShowDashboard(false);
    }
  }, [status]);

  if (status === "authenticated" && showDashboard) {
    return (
      <div className="flex flex-col min-h-screen bg-nust-offwhite text-slate-900 dark:bg-nust-dark dark:text-slate-100 transition-colors duration-500 relative overflow-hidden">
        {/* Abstract Background Image */}
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5 pointer-events-none">
          <Image
            src="/images/videoSecure.jpg"
            alt="Background Pattern"
            fill
            className="object-cover"
            priority
          />
        </div>
        <Header />
        <main className="flex-grow px-6 py-28 md:px-10 relative z-10">
          <div className="fade-in-up max-w-7xl mx-auto">
            <div className="flex justify-center mb-8 lg:hidden">
               <Image 
                 src="/nust-logo.png" 
                 alt="NUST Logo" 
                 width={120} 
                 height={120} 
                 priority 
                 className="object-contain drop-shadow-md"
               />
            </div>
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start">
              {/* PRIMARY HERO SECTION */}
              <section className="glass-panel p-10 lg:p-14 fade-in-up flex flex-col justify-center min-h-[440px]">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nust-blue/5 dark:bg-white/5 border border-nust-blue/10 dark:border-white/10 mb-8 w-fit backdrop-blur-sm">
                   <span className="flex h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                   <span className="text-xs font-bold tracking-widest uppercase text-nust-blue dark:text-blue-300">Official Virtual Campus</span>
                </div>
                
                <h1 className="mb-6 text-5xl font-extrabold leading-[1.1] tracking-tight md:text-6xl lg:text-[4rem] text-slate-900 dark:text-white">
                  Welcome, <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-nust-blue to-blue-600 dark:from-blue-300 dark:to-blue-500">
                    {session?.user?.name?.split(" ")[0] || "Scholar"}
                  </span>
                </h1>
                
                <p className="mb-10 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                  Experience frictionless academic collaboration. Start a secure class, host a high-definition viva, or jump into your next research discussion instantly.
                </p>
                <MeetingAction />
              </section>

              {/* COMMAND CENTER SIDEBAR */}
              <section className="glass-panel p-10 fade-in-up delay-75 flex flex-col min-h-[440px]">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Academic Hub
                  </h2>
                  <Button variant="ghost" size="sm" className="hidden sm:flex text-nust-blue dark:text-blue-300 hover:bg-nust-blue/10 dark:hover:bg-blue-500/10">View All</Button>
                </div>
                
                <div className="flex-1">
                  <h3 className="mb-5 text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">
                    Today's Agenda
                  </h3>
                  <div className="relative space-y-6 pl-5 before:absolute before:bottom-2 before:left-[9px] before:top-2 before:w-px before:bg-slate-200 dark:before:bg-slate-700/50">
                    {UPCOMING_LECTURES.map((lecture) => (
                      <div key={lecture.title} className="flex items-start gap-4 group cursor-pointer">
                        <div className="absolute left-0 mt-1.5 h-[19px] w-[19px] rounded-full border-4 border-[#fdfdfd] dark:border-[#020817] bg-nust-blue dark:bg-blue-400 transition-transform group-hover:scale-125 shadow-sm" />
                        <div className="transform transition-transform group-hover:translate-x-1">
                          <p className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-nust-blue dark:group-hover:text-blue-300 transition-colors">
                            {lecture.time} • {lecture.title}
                          </p>
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">{lecture.venue}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 rounded-2xl bg-gradient-to-br from-nust-blue/5 to-nust-blue/10 dark:from-blue-500/10 dark:to-blue-700/10 p-5 border border-nust-blue/10 dark:border-blue-500/20">
                  <p className="text-sm font-semibold text-nust-blue dark:text-blue-300 leading-relaxed">
                    Pro Tip: Use the unified Whiteboard for visual design reviews during your remote sessions.
                  </p>
                </div>
              </section>
            </div>

            {/* BOTTOM FEATURE CARDS & FOOTER */}
            <div className="glass-panel mt-10 p-10 fade-in-up delay-150 relative overflow-hidden">
              {/* Subtle accent glow inside feature card */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-nust-blue/5 dark:bg-blue-500/10 blur-[80px] pointer-events-none rounded-full" />
              <h2 className="mb-8 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Collaboration Spotlight
              </h2>
              <MeetingFeature />
            </div>

            <footer className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/50 dark:border-slate-800 pt-8 pb-4 text-sm font-medium text-slate-500 dark:text-slate-400 fade-in-up delay-150">
              <div className="flex gap-6">
                <a href="#" className="hover:text-nust-blue dark:hover:text-blue-300 transition-colors">Support</a>
                <a href="#" className="hover:text-nust-blue dark:hover:text-blue-300 transition-colors">Privacy</a>
                <a href="#" className="hover:text-nust-blue dark:hover:text-blue-300 transition-colors">Terms</a>
              </div>
              <p className="flex items-center gap-2">
                NUSTream by NUST <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span> v1.3.0
              </p>
            </footer>
          </div>
        </main>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-nust-offwhite text-slate-900 dark:bg-nust-dark dark:text-slate-100 transition-colors duration-500">
      <ThemeToggleButton className="fixed right-5 top-5 z-50" />
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-5">
        <section className="relative overflow-hidden bg-nust-blue px-8 py-12 text-white lg:col-span-3 lg:px-14 lg:py-16">
          <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:56px_56px]" />
          <div className="pointer-events-none absolute inset-0 bg-nust-blue/75" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/10" />

          <div className="relative z-10 mx-auto flex h-full max-w-2xl flex-col justify-between gap-10">
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur">
                NUSTream
              </div>

              <div className="space-y-5">
                <h1 className="text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
                  Virtual Campus, Real Connection.
                </h1>
                <p className="max-w-xl text-base leading-relaxed text-blue-50/90 md:text-lg">
                  The official next-generation video conferencing platform for
                  NUST.
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              {FEATURE_ITEMS.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.75rem] border border-white/10 bg-white/10 p-4 backdrop-blur-md transition-colors duration-300 hover:bg-white/15"
                >
                  <div className="mb-2 flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-blue-200" />
                    <h2 className="text-sm font-semibold text-white md:text-base">
                      {item.title}
                    </h2>
                  </div>
                  <p className="text-sm leading-relaxed text-blue-50/85">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative flex items-center justify-center bg-nust-offwhite px-6 py-10 dark:bg-nust-dark lg:col-span-2 lg:px-10">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.06]">
            <Image
              src="/nust-logo.png"
              priority
              width={420}
              height={420}
              alt="NUST seal watermark"
              className="h-auto w-[70%] object-contain"
            />
          </div>
          <div className="glass-panel relative z-10 w-full max-w-md rounded-[2.5rem] px-8 py-10">
            <div className="mb-8 h-1.5 w-16 rounded-full bg-nust-blue dark:bg-blue-400" />

            <div className="mb-8 flex items-center gap-4">
              <div className="h-14 w-14 overflow-hidden rounded-xl border border-slate-200 bg-white p-2">
                <Image
                  src="/nust-logo.png"
                  width={64}
                  height={64}
                  alt="NUST logo"
                  className="h-full w-full object-contain"
                  priority
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-nust-blue dark:text-blue-300">
                  Welcome to NUSTream
                </h2>
                <p className="text-sm text-slate-500">
                  Secure institutional sign-in
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (status === "authenticated") {
                  setShowDashboard(true);
                  return;
                }
                signIn("google", { callbackUrl: "/" });
              }}
              disabled={status === "loading"}
              className="flex w-full items-center justify-center gap-3 rounded-[1.35rem] border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-nust-blue hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Nust Gmail
            </button>

            <div className="mt-6 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-white/70 p-2 backdrop-blur dark:bg-nust-dark/40">
                <p className="text-sm font-bold text-nust-blue dark:text-blue-300">500+</p>
                <p className="text-[10px] text-slate-600 dark:text-slate-300">Active Classes</p>
              </div>
              <div className="rounded-xl bg-white/70 p-2 backdrop-blur dark:bg-nust-dark/40">
                <p className="text-sm font-bold text-nust-blue dark:text-blue-300">10k+</p>
                <p className="text-[10px] text-slate-600 dark:text-slate-300">Students</p>
              </div>
              <div className="rounded-xl bg-white/70 p-2 backdrop-blur dark:bg-nust-dark/40">
                <p className="text-sm font-bold text-nust-blue dark:text-blue-300">SEECS</p>
                <p className="text-[10px] text-slate-600 dark:text-slate-300">Verified</p>
              </div>
            </div>

            <p className="mt-6 text-center text-xs leading-relaxed text-slate-500">
              Access is limited to official <strong>@nust.edu.pk</strong> and{" "}
              <strong>@seecs.edu.pk</strong> domains.
            </p>

            <div className="mt-5 flex items-center justify-end gap-2 text-xs text-slate-600 dark:text-slate-300">
              <span className="relative inline-flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              NUSTream Systems Operational
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}





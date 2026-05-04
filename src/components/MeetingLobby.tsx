"use client";

import { Clipboard, Mic, MicOff, ShieldCheck, Video, VideoOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type MeetingLobbyProps = {
  roomId: string;
  displayName: string;
  micEnabled: boolean;
  cameraEnabled: boolean;
  isLoading?: boolean;
  onMicToggle: () => void;
  onCameraToggle: () => void;
  onEnter: () => void;
  onCopyMeetingId: () => void;
  onCopyMeetingLink: () => void;
};

export default function MeetingLobby({
  roomId,
  displayName,
  micEnabled,
  cameraEnabled,
  isLoading = false,
  onMicToggle,
  onCameraToggle,
  onEnter,
  onCopyMeetingId,
  onCopyMeetingLink,
}: MeetingLobbyProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const syncPreview = async () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;

      if (!cameraEnabled) {
        if (videoRef.current) videoRef.current.srcObject = null;
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        setCameraError(false);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (_error) {
        setCameraError(true);
      }
    };

    syncPreview();

    return () => {
      isMounted = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [cameraEnabled]);

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <main className="grid min-h-screen place-items-center px-5 py-8">
      <section className="fade-in-up w-full max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onCopyMeetingId}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-300/70 bg-white/70 px-3 py-2 text-xs font-medium text-slate-700 backdrop-blur transition-all duration-200 hover:scale-[1.03] hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/15 active:scale-95"
            aria-label="Copy meeting ID"
            title="Copy meeting ID"
          >
            <Clipboard className="h-3.5 w-3.5" />
            {roomId.slice(0, 8)}
          </button>
          <div className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-white/60">
            <ShieldCheck className="h-4 w-4 text-blue-400" />
            NUST secured room
          </div>
        </div>

        <div className="glass-panel grid overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/80 dark:border-white/10 dark:bg-slate-900/40 md:grid-cols-[1.25fr_0.75fr]">
          <div className="min-h-[360px] p-4 md:p-5">
            <div className="relative grid h-full min-h-[340px] place-items-center overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#071524] dark:to-[#0b2237]">
              {cameraEnabled && !cameraError ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="h-full min-h-[340px] w-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <div className="mx-auto mb-5 grid h-24 w-24 place-items-center rounded-full bg-blue-200 text-3xl font-bold text-nust-blue dark:bg-blue-500">
                    {initials || "NS"}
                  </div>
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{displayName}</h1>
                  <p className="mt-2 text-sm text-slate-500 dark:text-white/55">
                    {cameraError ? "Camera unavailable" : "Camera is off"}
                  </p>
                </div>
              )}

              <div className="absolute bottom-4 left-4 flex gap-2">
                <span className="rounded-full bg-white/70 px-3 py-1.5 text-xs text-slate-700 backdrop-blur dark:bg-black/35 dark:text-white/80">
                  {micEnabled ? "Mic on" : "Mic muted"}
                </span>
                <span className="rounded-full bg-white/70 px-3 py-1.5 text-xs text-slate-700 backdrop-blur dark:bg-black/35 dark:text-white/80">
                  {cameraEnabled ? "Camera on" : "Camera off"}
                </span>
              </div>
            </div>
          </div>

          <aside className="flex flex-col justify-between border-t border-white/10 p-6 md:border-l md:border-t-0 md:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
                Device Settings
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-nust-blue dark:text-blue-300">
                Join with intention.
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Camera and microphone stay off by default for lecture etiquette.
              </p>
            </div>

            <div className="my-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-1">
              <button
                type="button"
                onClick={onMicToggle}
                className={`inline-flex h-14 items-center justify-start gap-2 rounded-[1.25rem] border border-white/20 px-4 text-sm font-medium transition-all duration-200 hover:scale-[1.03] active:scale-95 ${
                  micEnabled
                    ? "bg-nust-blue text-white"
                    : "bg-white/40 text-slate-700 hover:bg-white/60 dark:bg-white/10 dark:text-slate-100"
                }`}
              >
                {micEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                Microphone
              </button>
              <button
                type="button"
                onClick={onCameraToggle}
                className={`inline-flex h-14 items-center justify-start gap-2 rounded-[1.25rem] border border-white/20 px-4 text-sm font-medium transition-all duration-200 hover:scale-[1.03] active:scale-95 ${
                  cameraEnabled
                    ? "bg-nust-blue text-white"
                    : "bg-white/40 text-slate-700 hover:bg-white/60 dark:bg-white/10 dark:text-slate-100"
                }`}
              >
                {cameraEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                Camera
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={onEnter}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[1.35rem] bg-nust-blue px-4 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.05] hover:bg-[#00264d] active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                disabled={isLoading}
                title={isLoading ? "Session is still loading" : "Enter meeting room"}
              >
                <Video className="h-4 w-4" />
                Enter room
              </button>
              <button
                type="button"
                onClick={onCopyMeetingLink}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[1.25rem] px-4 text-sm font-medium text-slate-700 transition-all duration-200 hover:scale-[1.03] hover:bg-white/50 active:scale-95 dark:text-slate-200 dark:hover:bg-white/10"
              >
                <Clipboard className="h-4 w-4" />
                Copy link
              </button>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}


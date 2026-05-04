"use client";

import AttendanceButton from "@/components/AttendanceButton";
import ErrorBoundary from "@/components/ErrorBoundary";
import MeetingLobby from "@/components/MeetingLobby";
import NustWhiteboard from "@/components/NustWhiteboard";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMeetingRoom } from "@/hooks/useMeetingRoom";
import { Clipboard, Pencil, ShieldCheck, Smile, Wifi } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const NETWORK_LABELS = {
  green: "Network healthy",
  yellow: "Network unstable",
  red: "Network disconnected",
};

const NETWORK_CLASSES = {
  green: "bg-emerald-400",
  yellow: "bg-blue-400",
  red: "bg-red-500",
};

const REACTION_PANEL_EMOJIS = [
  { emoji: "👍", label: "Thumbs Up" },
  { emoji: "👎", label: "Thumbs Down" },
  { emoji: "👏", label: "Clap" },
  { emoji: "❤️", label: "Heart" },
  { emoji: "😂", label: "Cry Laugh" },
  { emoji: "😮", label: "Surprised" },
];

function NetworkHealthBadge({ health }) {
  return (
    <div className="absolute right-5 top-5 z-40 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 text-xs font-medium text-white/90 backdrop-blur-md">
      <span className={`h-2.5 w-2.5 rounded-full ${NETWORK_CLASSES[health]}`} />
      <Wifi className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{NETWORK_LABELS[health]}</span>
    </div>
  );
}

function AttendanceDisclosure() {
  return (
    <div className="absolute bottom-5 left-5 z-40 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 text-xs font-medium text-white/90 backdrop-blur-md">
      <ShieldCheck className="h-4 w-4 text-blue-300" />
      <span>Session Attendance is being logged.</span>
    </div>
  );
}

function Tooltip({ label }) {
  return (
    <span className="pointer-events-none absolute -top-9 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded bg-nust-dark px-2 py-1 text-xs font-medium text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100">
      {label}
    </span>
  );
}

function ReactionMenuButton({ onSendReaction, isOpen, onOpenChange }) {
  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`group relative inline-flex h-11 w-11 items-center justify-center rounded-full border text-white transition-transform hover:scale-105 active:scale-95 ${
            isOpen
              ? "border-[#F2A900] bg-[#F2A900]/20 ring-2 ring-[#F2A900]/40"
              : "border-white/20 bg-white/10 hover:bg-white/20"
          }`}
          aria-label="Send Reaction"
          title="Send Reaction"
          aria-expanded={isOpen}
        >
          <Tooltip label="Send Reaction" />
          <Smile className="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        side="top"
        sideOffset={14}
        className="w-[19rem] rounded-2xl border border-white/20 bg-slate-900/80 p-3 shadow-2xl backdrop-blur-xl"
      >
        <div className="grid grid-cols-6 gap-2">
          {REACTION_PANEL_EMOJIS.map(({ emoji, label }) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                onSendReaction(emoji);
                onOpenChange(false);
              }}
              className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 text-2xl leading-none transition-transform hover:scale-105 hover:border-[#F2A900]/60 hover:bg-[#F2A900]/15 active:scale-95"
              aria-label={`Send reaction ${label}`}
              title={label}
            >
              {emoji}
            </button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

async function sendReaction(zp, roomId, emoji, onLocalReaction) {
  const payload = JSON.stringify({ type: "REACTION", emoji, roomId });
  onLocalReaction?.(emoji);

  try {
    if (zp && typeof zp.sendInRoomCommand === "function") {
      await zp.sendInRoomCommand(payload, []);
      return;
    }

    if (zp && typeof zp.sendInRoomCustomCommand === "function") {
      await zp.sendInRoomCustomCommand({ type: "REACTION", emoji, roomId });
    }
  } catch (_error) {
    // Local feedback has already been rendered.
  }
}

export default function VideoMeeting() {
  const params = useParams();
  const roomID = String(params.roomId);
  const { data: session, status } = useSession();
  const meeting = useMeetingRoom({
    roomId: roomID,
    sessionUser: session?.user,
    authStatus: status,
  });
  const [isReactionMenuOpen, setIsReactionMenuOpen] = useState(false);
  const attendanceProps = {
    roomId: roomID,
    participants: meeting.participants,
    sessionLog: meeting.sessionLog,
    attendanceTotals: meeting.attendanceTotals,
    isReady: Boolean(meeting.zp),
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        meeting.hasEnteredMeeting ? "bg-[#061525] text-slate-100" : "bg-slate-100 text-slate-900 dark:bg-[#061525] dark:text-slate-100"
      }`}
      onMouseMove={meeting.handlePointerActivity}
      onTouchStart={meeting.handlePointerActivity}
    >
      <ThemeToggleButton
        className={`fixed right-5 z-[9999] pointer-events-auto ${meeting.hasEnteredMeeting ? "top-20" : "top-5"}`}
      />

      {!meeting.hasEnteredMeeting && (
        <MeetingLobby
          roomId={roomID}
          displayName={session?.user?.name || "Guest"}
          micEnabled={meeting.micEnabled}
          cameraEnabled={meeting.cameraEnabled}
          isLoading={status === "loading"}
          onMicToggle={() => meeting.setMicEnabled((value) => !value)}
          onCameraToggle={() => meeting.setCameraEnabled((value) => !value)}
          onEnter={() => meeting.setHasEnteredMeeting(true)}
          onCopyMeetingId={meeting.copyMeetingId}
          onCopyMeetingLink={meeting.copyMeetingLink}
        />
      )}

      {meeting.hasEnteredMeeting && (
        <div className="fade-in-up relative h-screen overflow-hidden">
          <ErrorBoundary label="Video Grid">
            <div ref={meeting.containerRef} className="video-container h-full bg-[#061525]" />
          </ErrorBoundary>

          {meeting.isInMeeting && (
            <>
              <button
                type="button"
                onClick={meeting.copyMeetingId}
                className={`absolute left-5 top-5 z-40 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 text-xs font-medium text-white/90 backdrop-blur-md transition-all duration-300 hover:bg-black/35 active:scale-95 ${
                  meeting.controlsVisible ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                aria-label="Copy meeting ID"
                title="Copy meeting ID"
              >
                <Clipboard className="h-4 w-4" />
                {roomID.slice(0, 8)}
              </button>

              <NetworkHealthBadge health={meeting.networkHealth} />
              <AttendanceDisclosure />
            </>
          )}

                    {meeting.isInMeeting && (
            <div className="pointer-events-none absolute inset-0 z-30">
              {meeting.reactions.map((reaction) => (
                <div
                  key={reaction.id}
                  className="absolute bottom-12 animate-float-up text-4xl"
                  style={{
                    left: `${reaction.x}%`,
                    "--drift": `${reaction.drift}px`,
                  }}
                >
                  {reaction.emoji}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {meeting.isInMeeting && (
        <div
          className={`fixed bottom-24 left-1/2 z-[70] -translate-x-1/2 rounded-full border border-white/12 bg-slate-900/80 px-3 py-2 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
            meeting.controlsVisible ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div className="inline-flex items-center gap-3">
            <ReactionMenuButton
              onSendReaction={(emoji) => sendReaction(meeting.zp, roomID, emoji, meeting.addReaction)}
              isOpen={isReactionMenuOpen}
              onOpenChange={setIsReactionMenuOpen}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => meeting.setIsWhiteboardOpen(true)}
              className="group relative h-11 w-11 rounded-full text-white hover:scale-105 hover:bg-white/10"
              aria-label="Open Whiteboard"
              title="Open Whiteboard"
            >
              <Tooltip label="Open Whiteboard" />
              <Pencil className="h-5 w-5" />
            </Button>
            <AttendanceButton {...attendanceProps} />
          </div>
        </div>
      )}

      <ErrorBoundary label="Whiteboard">
        <NustWhiteboard
          isOpen={meeting.isWhiteboardOpen}
          onClose={() => meeting.setIsWhiteboardOpen(false)}
        />
      </ErrorBoundary>
    </div>
  );
}


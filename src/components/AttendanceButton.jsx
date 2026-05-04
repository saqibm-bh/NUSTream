"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "react-toastify";

function escapeCsv(value) {
  const text = String(value ?? "");
  if (text.includes('"') || text.includes(",") || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function formatDateStamp(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function AttendanceButton({
  roomId,
  participants,
  sessionLog,
  attendanceTotals,
  isReady,
  compact = false,
}) {
  const handleDownload = () => {
    if (!isReady) {
      toast.error("Meeting engine is still initializing. Please try again.");
      return;
    }

    const events = sessionLog || [];

    if (events.length === 0) {
      toast.info("No attendance events recorded yet.");
      return;
    }

    const generatedAt = new Date();
    const uniqueParticipantIds = new Set(
      events.map((event) => event.idValue || event.userID || event.id).filter(Boolean)
    );
    const rows = [
      [`NUSTream Official Attendance - ${roomId}`],
      ["Generated At", generatedAt.toISOString()],
      [],
      ["Name", "ID", "Event Type", "Exact Timestamp"],
      ...events.map((event) => [
        event.name || event.userName || "Unknown",
        event.idValue || event.userID || event.id,
        event.action || event.event,
        event.timestamp || event.time,
      ]),
      [],
      ["Summary"],
      ["Unique Participants Count", uniqueParticipantIds.size || participants?.length || 0],
      [],
      ["Name", "ID", "Total Minutes Present"],
      ...Array.from((attendanceTotals || new Map()).values()).map((entry) => [
        entry.userName || "Unknown",
        entry.userID,
        entry.totalMinutes,
      ]),
    ];

    const csv = rows
      .map((row) => row.map((cell) => escapeCsv(String(cell ?? ""))).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `NUST_Attendance_${roomId}_${formatDateStamp(generatedAt)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    toast.success(`Attendance exported (${events.length} events).`);
  };

  return (
    <Button
      onClick={handleDownload}
      aria-disabled={!isReady}
      className={
        compact
          ? `h-11 w-11 bg-nust-blue p-0 transition hover:scale-105 hover:bg-[#00264d] active:scale-95 ${
              !isReady ? "cursor-not-allowed opacity-50" : ""
            }`
          : `min-h-11 rounded-[1.25rem] bg-[#003366] text-white transition hover:bg-[#00264d] active:scale-[0.98] ${
              !isReady ? "cursor-not-allowed opacity-50" : ""
            }`
      }
      size={compact ? "icon" : "sm"}
      type="button"
      title={isReady ? "Export attendance CSV" : "Meeting engine is still initializing"}
      aria-label={isReady ? "Export attendance CSV" : "Attendance export unavailable while meeting initializes"}
    >
      <Download className={compact ? "h-4 w-4" : "mr-2 h-4 w-4"} />
      {!compact && "Download Attendance"}
    </Button>
  );
}

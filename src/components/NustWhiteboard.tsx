"use client";

import dynamic from "next/dynamic";
import { X } from "lucide-react";

import "@excalidraw/excalidraw/index.css";

const Excalidraw = dynamic(
  async () => {
    const mod = await import("@excalidraw/excalidraw");
    return mod.Excalidraw;
  },
  { ssr: false }
);

type NustWhiteboardProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function NustWhiteboard({ isOpen, onClose }: NustWhiteboardProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] pointer-events-none">
      <section className="pointer-events-auto fixed left-1/2 top-1/2 h-[80vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.5rem] border border-white/20 bg-white/70 shadow-xl backdrop-blur-xl">
        <div className="absolute right-4 top-4 z-20">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 items-center rounded-[1.15rem] bg-[#A50021] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7f0019] active:scale-[0.98]"
            aria-label="Close whiteboard"
          >
            <X className="mr-2 h-4 w-4" />
            Close Whiteboard
          </button>
        </div>
        <div className="h-full w-full">
          <Excalidraw />
        </div>
      </section>
    </div>
  );
}

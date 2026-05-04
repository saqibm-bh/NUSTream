"use client";

type ReactionBarProps = {
  zp: any;
  roomId: string;
  onLocalReaction?: (emoji: string) => void;
};

const EMOJIS = ["\u{1F44F}", "\u{1F4AF}", "\u{1F602}"];

export default function ReactionBar({ zp, roomId, onLocalReaction }: ReactionBarProps) {
  const sendReaction = async (emoji: string) => {
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
  };

  return (
    <div className="flex gap-2 rounded-full border border-white/10 bg-white/15 p-2 backdrop-blur-md">
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => sendReaction(emoji)}
          className="grid h-11 w-11 place-items-center rounded-full text-2xl leading-none transition-transform hover:scale-105 hover:bg-white/10 active:scale-95"
          aria-label={`Send reaction ${emoji}`}
          title={`Send reaction ${emoji}`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

"use client";

import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

type SessionUser = {
  id?: string;
  name?: string | null;
};

type UseMeetingRoomArgs = {
  roomId: string;
  sessionUser?: SessionUser | null;
  authStatus: string;
};

type AttendanceAction = "JOINED" | "LEFT";

type AttendanceEvent = {
  id: string;
  name: string;
  action: AttendanceAction;
  userID: string;
  idValue: string;
  userName: string;
  event: AttendanceAction;
  time: string;
  timestamp: string;
};

const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const getUserId = (rawUser: any) => rawUser?.userID || rawUser?.userId || rawUser?.id;
const getUserName = (rawUser: any) => rawUser?.userName || rawUser?.name || "Unknown";

export function useMeetingRoom({ roomId, sessionUser, authStatus }: UseMeetingRoomArgs) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controlsHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reactionTimeoutIdsRef = useRef<Set<number>>(new Set());
  const activeAttendanceRef = useRef<Map<string, any>>(new Map());
  const attendanceTotalsRef = useRef<Map<string, any>>(new Map());
  const recentAttendanceEventRef = useRef<Map<string, number>>(new Map());

  const [zp, setZp] = useState<any>(null);
  const [hasEnteredMeeting, setHasEnteredMeeting] = useState(false);
  const [isInMeeting, setIsInMeeting] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [controlBarMountNode, setControlBarMountNode] = useState<Element | null>(null);
  const [reactionMountNode, setReactionMountNode] = useState<Element | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
  const [reactions, setReactions] = useState<any[]>([]);
  const [sessionLog, setSessionLog] = useState<AttendanceEvent[]>([]);
  const [networkHealth, setNetworkHealth] = useState<"green" | "yellow" | "red">("green");

  const calculateAttendanceTotals = useCallback(() => {
    const now = new Date();
    const totals = new Map();

    attendanceTotalsRef.current.forEach((entry, userID) => {
      totals.set(userID, {
        userID,
        userName: entry.userName,
        totalMinutes: Math.round((entry.totalMs / 60000) * 100) / 100,
      });
    });

    activeAttendanceRef.current.forEach((entry, userID) => {
      const previous = totals.get(userID) || {
        userID,
        userName: entry.userName,
        totalMinutes: 0,
      };
      const activeMinutes =
        Math.round(((now.getTime() - entry.joinedAt.getTime()) / 60000) * 100) / 100;
      totals.set(userID, {
        ...previous,
        userName: previous.userName || entry.userName,
        totalMinutes: Math.round((previous.totalMinutes + activeMinutes) * 100) / 100,
      });
    });

    return totals;
  }, []);

  const recordAttendanceEvent = useCallback(
    (rawUser: any, action: AttendanceAction) => {
      const userID = getUserId(rawUser);
      if (!userID) return;

      const now = new Date();
      const userName = getUserName(rawUser);
      const duplicateKey = `${userID}:${action}`;
      const lastAt = recentAttendanceEventRef.current.get(duplicateKey) || 0;
      if (now.getTime() - lastAt < 1200) return;
      recentAttendanceEventRef.current.set(duplicateKey, now.getTime());

      if (action === "JOINED") {
        activeAttendanceRef.current.set(userID, { joinedAt: now, userID, userName });
      }

      if (action === "LEFT") {
        const activeEntry = activeAttendanceRef.current.get(userID);
        if (activeEntry?.joinedAt) {
          const previous = attendanceTotalsRef.current.get(userID) || {
            userID,
            userName,
            totalMs: 0,
          };
          attendanceTotalsRef.current.set(userID, {
            ...previous,
            userName: previous.userName || userName,
            totalMs: previous.totalMs + (now.getTime() - activeEntry.joinedAt.getTime()),
          });
          activeAttendanceRef.current.delete(userID);
        }
      }

      setSessionLog((prev) => [
        ...prev,
        {
          id: `${userID}-${action}-${now.getTime()}`,
          name: userName,
          action,
          userID,
          idValue: userID,
          userName,
          event: action,
          time: formatTime(now),
          timestamp: now.toISOString(),
        },
      ]);
    },
    []
  );

  const addReaction = useCallback((emoji: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000000);
    const x = 20 + Math.random() * 60;
    const drift = -18 + Math.random() * 36;
    setReactions((prev) => [...prev, { id, emoji, x, drift }]);
  }, []);

  const handleIncomingCommand = useCallback(
    (command: unknown) => {
      try {
        const data = typeof command === "string" ? JSON.parse(command) : command;
        if ((data as any)?.type === "REACTION" && (data as any)?.emoji) {
          addReaction((data as any).emoji);
        }
      } catch (_error) {
        // Ignore non-JSON commands.
      }
    },
    [addReaction]
  );

  const copyMeetingId = useCallback(async () => {
    await navigator.clipboard.writeText(roomId);
    toast.success("Meeting ID copied");
  }, [roomId]);

  const copyMeetingLink = useCallback(async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/video-meeting/${roomId}`);
    toast.success("Meeting link copied");
  }, [roomId]);

  const resetAttendance = useCallback(() => {
    setParticipants([]);
    setSessionLog([]);
    activeAttendanceRef.current.clear();
    attendanceTotalsRef.current.clear();
    recentAttendanceEventRef.current.clear();
  }, []);

  const endMeeting = useCallback(() => {
    if (zp) {
      zp.destroy();
    }
    toast.success("Meeting ended");
    setZp(null);
    setIsInMeeting(false);
    setHasEnteredMeeting(false);
    setIsWhiteboardOpen(false);
    resetAttendance();
    setReactions([]);
    reactionTimeoutIdsRef.current.clear();
    router.push("/");
  }, [resetAttendance, router, zp]);

  const joinMeeting = useCallback(
    async (element: HTMLDivElement) => {
      const response = await fetch("/api/zego/generate-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to generate meeting token");
      }

      const { token, appID } = await response.json();
      const self = {
        userID: sessionUser?.id || Date.now().toString(),
        userName: sessionUser?.name || "Guest",
      };
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
        Number(appID),
        token,
        roomId,
        self.userID,
        self.userName
      );

      const zegoInstance = ZegoUIKitPrebuilt.create(kitToken);
      setZp(zegoInstance);

      const expressEngine = zegoInstance?.express as any;
      if (expressEngine && typeof expressEngine.on === "function") {
        expressEngine.on("roomUserUpdate", (_roomId: string, updateType: string, userList: any[]) => {
          const action: AttendanceAction = updateType === "DELETE" ? "LEFT" : "JOINED";
          (userList || []).forEach((user) => recordAttendanceEvent(user, action));
        });
      }

      zegoInstance.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: "Join via this link",
            url: `${window.location.origin}/video-meeting/${roomId}`,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall,
        },
        showAudioVideoSettingsButton: true,
        showScreenSharingButton: true,
        showTurnOffRemoteCameraButton: true,
        showTurnOffRemoteMicrophoneButton: true,
        showRemoveUserButton: true,
        showPreJoinView: false,
        turnOnMicrophoneWhenJoining: micEnabled,
        turnOnCameraWhenJoining: cameraEnabled,
        autoHideFooter: false,
        onJoinRoom: () => {
          toast.success("Meeting joined successfully");
          setIsInMeeting(true);
          recordAttendanceEvent(self, "JOINED");
          setParticipants((prev) => {
            const unique = new Map([...prev, self].map((participant) => [participant.userID, participant]));
            return Array.from(unique.values());
          });
        },
        onUserJoin: (users: any[]) => {
          (users || []).forEach((user) => recordAttendanceEvent(user, "JOINED"));
          setParticipants((prev) => {
            const nextUsers = (users || []).map((user) => ({
              userID: getUserId(user),
              userName: getUserName(user),
            }));
            const unique = new Map([...prev, ...nextUsers].map((participant) => [participant.userID, participant]));
            return Array.from(unique.values());
          });
        },
        onUserLeave: (users: any[]) => {
          (users || []).forEach((user) => recordAttendanceEvent(user, "LEFT"));
          setParticipants((prev) => {
            const leftIds = new Set((users || []).map((user) => getUserId(user)));
            return prev.filter((participant) => !leftIds.has(participant.userID));
          });
        },
        onInRoomCommandReceived: (_fromUser: any, command: unknown) => {
          handleIncomingCommand(command);
        },
        onLeaveRoom: () => {
          endMeeting();
        },
      });
    },
    [
      cameraEnabled,
      endMeeting,
      handleIncomingCommand,
      micEnabled,
      recordAttendanceEvent,
      roomId,
      sessionUser?.id,
      sessionUser?.name,
    ]
  );

  useEffect(() => {
    const initMeeting = async () => {
      if (
        hasEnteredMeeting &&
        authStatus === "authenticated" &&
        sessionUser?.name &&
        containerRef.current &&
        !zp
      ) {
        try {
          await joinMeeting(containerRef.current);
        } catch (error: any) {
          toast.error(error.message || "Unable to join meeting");
          setHasEnteredMeeting(false);
        }
      }
    };

    initMeeting();
  }, [authStatus, hasEnteredMeeting, joinMeeting, sessionUser?.name, zp]);

  useEffect(() => {
    return () => {
      if (zp) {
        zp.destroy();
      }
    };
  }, [zp]);

  useEffect(() => {
    reactions.forEach((reaction) => {
      if (reactionTimeoutIdsRef.current.has(reaction.id)) return;
      reactionTimeoutIdsRef.current.add(reaction.id);

      setTimeout(() => {
        setReactions((prev) => prev.filter((item) => item.id !== reaction.id));
        reactionTimeoutIdsRef.current.delete(reaction.id);
      }, 3000);
    });
  }, [reactions]);

  useEffect(() => {
    if (!zp || typeof zp.on !== "function") return;

    const handler = (_fromUser: any, command: unknown) => {
      handleIncomingCommand(command);
    };

    zp.on("inRoomCommandReceived", handler);

    return () => {
      if (typeof zp.off === "function") {
        zp.off("inRoomCommandReceived", handler);
      } else if (typeof zp.removeListener === "function") {
        zp.removeListener("inRoomCommandReceived", handler);
      }
    };
  }, [handleIncomingCommand, zp]);

  useEffect(() => {
    if (!isInMeeting || !containerRef.current) {
      setControlBarMountNode(null);
      return;
    }

    const container = containerRef.current;

    const resolveControlBarAnchor = () => {
      const buttons = Array.from(container.querySelectorAll("button"));
      if (buttons.length < 4) return null;

      const candidates: Array<{ node: HTMLElement; nestedButtons: number; width: number }> = [];
      buttons.forEach((btn) => {
        let node = btn.parentElement;
        let hops = 0;
        while (node && hops < 6) {
          const nestedButtons = node.querySelectorAll("button").length;
          if (nestedButtons >= 4) {
            const rect = node.getBoundingClientRect();
            const rootRect = container.getBoundingClientRect();
            const nearBottom = rect.bottom >= rootRect.bottom - 220;
            if (nearBottom) {
              candidates.push({ node, nestedButtons, width: rect.width });
            }
          }
          node = node.parentElement;
          hops += 1;
        }
      });

      if (!candidates.length) return null;
      candidates.sort((a, b) => {
        if (b.nestedButtons !== a.nestedButtons) return b.nestedButtons - a.nestedButtons;
        return b.width - a.width;
      });
      return candidates[0].node;
    };

    const styleAnchor = (anchor: HTMLElement) => {
      anchor.style.position = "fixed";
      anchor.style.left = "50%";
      anchor.style.bottom = "32px";
      anchor.style.transform = "translateX(-50%)";
      anchor.style.zIndex = "50";
      anchor.style.display = "flex";
      anchor.style.alignItems = "center";
      anchor.style.justifyContent = "center";
      anchor.style.gap = "12px";
      anchor.style.border = "1px solid rgba(255,255,255,0.12)";
      anchor.style.borderRadius = "9999px";
      anchor.style.background = "rgba(15,23,42,0.8)";
      anchor.style.backdropFilter = "blur(20px)";
      anchor.style.padding = "12px 24px";
      anchor.style.boxShadow = "0 20px 50px rgba(0, 0, 0, 0.35)";
      anchor.style.transition = "opacity 240ms ease, transform 240ms ease";
      anchor.style.opacity = controlsVisible ? "1" : "0";
      anchor.style.pointerEvents = controlsVisible ? "auto" : "none";
    };

    const ensureMountNode = () => {
      const anchor = resolveControlBarAnchor();
      if (!anchor) return;
      styleAnchor(anchor);

      // Mount reaction control after the second media button (Mic, Camera, then Reaction).
      let reactionMount = anchor.querySelector("[data-nust-reaction-anchor='true']");
      if (!reactionMount) {
        reactionMount = document.createElement("div");
        reactionMount.setAttribute("data-nust-reaction-anchor", "true");
        reactionMount.className = "inline-flex items-center";

        const directButtons = Array.from(anchor.children).filter(
          (node) => node instanceof HTMLButtonElement
        ) as HTMLButtonElement[];
        if (directButtons.length >= 2) {
          const insertAfter = directButtons[1];
          const insertBefore = insertAfter.nextSibling;
          anchor.insertBefore(reactionMount, insertBefore);
        } else {
          anchor.appendChild(reactionMount);
        }
      }

      let mount = anchor.querySelector("[data-nust-meeting-actions-anchor='true']");
      if (!mount) {
        mount = document.createElement("div");
        mount.setAttribute("data-nust-meeting-actions-anchor", "true");
        mount.className = "inline-flex items-center gap-3";
        anchor.appendChild(mount);
      }
      setReactionMountNode(reactionMount);
      setControlBarMountNode(mount);
    };

    ensureMountNode();
    const observer = new MutationObserver(() => {
      ensureMountNode();
    });
    observer.observe(container, { childList: true, subtree: true });

      return () => {
      observer.disconnect();
      setControlBarMountNode(null);
      setReactionMountNode(null);
    };
  }, [controlsVisible, isInMeeting]);

  const handlePointerActivity = useCallback(() => {
    setControlsVisible(true);
    if (controlsHideTimerRef.current) {
      clearTimeout(controlsHideTimerRef.current);
    }
    controlsHideTimerRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 3000);
  }, []);

  useEffect(() => {
    if (!isInMeeting) return;
    handlePointerActivity();
    return () => {
      if (controlsHideTimerRef.current) {
        clearTimeout(controlsHideTimerRef.current);
      }
    };
  }, [handlePointerActivity, isInMeeting]);

  useEffect(() => {
    const updateNetworkHealth = () => {
      if (!navigator.onLine) {
        setNetworkHealth("red");
        return;
      }

      const connection = (navigator as any).connection;
      const downlink = Number(connection?.downlink || 10);
      const rtt = Number(connection?.rtt || 50);

      if (downlink < 0.75 || rtt > 800) {
        setNetworkHealth("red");
      } else if (downlink < 2 || rtt > 300) {
        setNetworkHealth("yellow");
      } else {
        setNetworkHealth("green");
      }
    };

    updateNetworkHealth();
    window.addEventListener("online", updateNetworkHealth);
    window.addEventListener("offline", updateNetworkHealth);
    const connection = (navigator as any).connection;
    connection?.addEventListener?.("change", updateNetworkHealth);

    return () => {
      window.removeEventListener("online", updateNetworkHealth);
      window.removeEventListener("offline", updateNetworkHealth);
      connection?.removeEventListener?.("change", updateNetworkHealth);
    };
  }, []);

  return {
    addReaction,
    attendanceTotals: calculateAttendanceTotals(),
    cameraEnabled,
    containerRef,
    controlBarMountNode,
    reactionMountNode,
    controlsVisible,
    copyMeetingId,
    copyMeetingLink,
    endMeeting,
    handlePointerActivity,
    hasEnteredMeeting,
    isInMeeting,
    isWhiteboardOpen,
    micEnabled,
    networkHealth,
    participants,
    reactions,
    sessionLog,
    setCameraEnabled,
    setHasEnteredMeeting,
    setIsWhiteboardOpen,
    setMicEnabled,
    zp,
  };
}


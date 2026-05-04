import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { generateToken04 } from "@/lib/zegoServerAssistant";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roomId } = await request.json();
    if (!roomId || typeof roomId !== "string") {
      return NextResponse.json({ error: "Invalid roomId" }, { status: 400 });
    }

    const appID = Number(
      process.env.ZEGO_APP_ID || process.env.NEXT_PUBLIC_ZEGO_APP_ID
    );
    const serverSecret = process.env.ZEGO_SERVER_SECRET;
    if (!appID || !serverSecret) {
      return NextResponse.json(
        { error: "Zego configuration is missing" },
        { status: 500 }
      );
    }

    const userId = session.user.id || Date.now().toString();
    const token = generateToken04(
      appID,
      userId,
      serverSecret,
      3600,
      ""
    );

    return NextResponse.json({ token, appID });
  } catch (error) {
    console.error("Failed to generate Zego token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}

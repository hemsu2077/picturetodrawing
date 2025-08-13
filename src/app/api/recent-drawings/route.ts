import { auth } from "@/auth";
import { getImagesByUserUuid } from "@/models/image";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.uuid) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the 4 most recent drawings
    const drawings = await getImagesByUserUuid(session.user.uuid, 1, 4);
    
    return NextResponse.json({
      code: 0,
      message: "ok",
      data: drawings || []
    });
  } catch (error) {
    console.error("Error fetching recent drawings:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent drawings" },
      { status: 500 }
    );
  }
}

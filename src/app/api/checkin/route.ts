import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { performCheckin, getUserCheckinStatus } from "@/services/checkin";
import { respJson } from "@/lib/resp";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.uuid) {
      return respJson(401, "Unauthorized");
    }

    const result = await performCheckin(session.user.uuid);
    
    if (result.success) {
      return respJson(200, result.message, {
        credits_earned: result.credits_earned,
        consecutive_days: result.consecutive_days,
      });
    } else {
      return respJson(
        result.already_checked_in ? 208 : 400, 
        result.message,
        {
          credits_earned: result.credits_earned,
          consecutive_days: result.consecutive_days,
        }
      );
    }
  } catch (error) {
    console.error("Checkin API error:", error);
    return respJson(500, "Internal server error");
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.uuid) {
      return respJson(401, "Unauthorized");
    }

    const status = await getUserCheckinStatus(session.user.uuid);
    
    return respJson(0, "Success", status);
  } catch (error) {
    console.error("Get checkin status API error:", error);
    return respJson(500, "Internal server error");
  }
}

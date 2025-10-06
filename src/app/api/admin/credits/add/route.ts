import { respErr, respData } from "@/lib/resp";
import { getUserInfo } from "@/services/user";
import { findUserByEmail, findUserByUuid } from "@/models/user";
import { increaseCredits, CreditsTransType } from "@/services/credit";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const userInfo = await getUserInfo();
    if (!userInfo || !userInfo.email) {
      return respErr("no auth");
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(",");
    if (!adminEmails?.includes(userInfo.email)) {
      return respErr("no permission");
    }

    const body = await req.json();
    const { userIdentifier, credits, validMonths } = body;

    if (!userIdentifier || !credits || !validMonths) {
      return respErr("missing required fields");
    }

    // Find user by email or uuid
    let targetUser;
    if (userIdentifier.includes("@")) {
      targetUser = await findUserByEmail(userIdentifier);
    } else {
      targetUser = await findUserByUuid(userIdentifier);
    }

    if (!targetUser) {
      return respErr("user not found");
    }

    // Calculate expiration date
    const expiredAt = new Date();
    expiredAt.setMonth(expiredAt.getMonth() + parseInt(validMonths));

    // Add credits
    await increaseCredits({
      user_uuid: targetUser.uuid,
      trans_type: CreditsTransType.SystemAdd,
      credits: parseInt(credits),
      expired_at: expiredAt.toISOString(),
    });

    return respData({
      success: true,
      message: `Successfully added ${credits} credits to user ${targetUser.email}`,
    });
  } catch (e) {
    console.log("add credit failed: ", e);
    return respErr("add credit failed");
  }
}

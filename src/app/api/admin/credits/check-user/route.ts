import { respErr, respData } from "@/lib/resp";
import { getUserInfo } from "@/services/user";
import { findUserByEmail, findUserByUuid } from "@/models/user";
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
    const { userIdentifier } = body;

    if (!userIdentifier) {
      return respErr("user identifier is required");
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

    return respData({
      uuid: targetUser.uuid,
      email: targetUser.email,
      nickname: targetUser.nickname,
    });
  } catch (e) {
    console.log("check user failed: ", e);
    return respErr("check user failed");
  }
}

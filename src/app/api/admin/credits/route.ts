import { respErr, respData } from "@/lib/resp";
import { getSystemAddedCredits } from "@/models/credit";
import { getUserInfo } from "@/services/user";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const userInfo = await getUserInfo();
    if (!userInfo || !userInfo.email) {
      return respErr("no auth");
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(",");
    if (!adminEmails?.includes(userInfo.email)) {
      return respErr("no permission");
    }

    const credits = await getSystemAddedCredits(1, 100);

    return respData({ credits });
  } catch (e) {
    console.log("get system added credits failed: ", e);
    return respErr("get system added credits failed");
  }
}

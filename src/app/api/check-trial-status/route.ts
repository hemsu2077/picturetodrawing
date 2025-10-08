import { respData, respErr } from "@/lib/resp";
import { auth } from "@/auth";
import { isAuthEnabled } from "@/lib/auth";
import { checkDailyTrial } from "@/services/trial";

export async function GET() {
  try {
    let userUuid = "";
    
    // Get user session if auth is enabled
    if (isAuthEnabled()) {
      const session = await auth();
      if (session?.user?.uuid) {
        userUuid = session.user.uuid;
      }
    }

    // Daily trial now requires login
    if (!userUuid) {
      return respData({
        canUseTrial: false,
        isTrialUsage: false,
        isLoggedIn: false
      });
    }

    // Check daily trial availability for logged-in user
    const trialCheck = await checkDailyTrial(userUuid);
    
    return respData({
      canUseTrial: trialCheck.canUseTrial,
      isTrialUsage: trialCheck.isTrialUsage,
      isLoggedIn: true
    });
  } catch (error) {
    console.error("Error checking trial status:", error);
    return respErr("Failed to check trial status");
  }
}

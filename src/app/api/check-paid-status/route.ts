import { respData, respErr } from "@/lib/resp";
import { auth } from "@/auth";
import { isAuthEnabled } from "@/lib/auth";
import { getLatestPaidOrderByUserUuid } from "@/models/order";

export async function GET() {
  try {
    if (!isAuthEnabled()) {
      return respData({ isPaid: false });
    }

    const session = await auth();
    
    if (!session?.user?.uuid) {
      return respData({ isPaid: false });
    }

    const userUuid = session.user.uuid;
    const paidOrder = await getLatestPaidOrderByUserUuid(userUuid);
    
    const isPaid = !!paidOrder;
    
    return respData({ isPaid });
  } catch (error) {
    return respErr("Failed to check paid status");
  }
}

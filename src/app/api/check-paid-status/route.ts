import { respData, respErr } from "@/lib/resp";
import { auth } from "@/auth";
import { isAuthEnabled } from "@/lib/auth";
import { getFirstPaidOrderByUserUuid } from "@/models/order";

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
    const paidOrder = await getFirstPaidOrderByUserUuid(userUuid);
    
    if (!paidOrder) {
      return respData({ isPaid: false });
    }

    // 检查订单是否过期
    const now = new Date();
    const expiredAt = new Date(paidOrder.expired_at!);
    const isPaid = now < expiredAt;

    return respData({ isPaid });
  } catch (error) {
    console.error("Error checking paid status:", error);
    return respErr("Failed to check paid status");
  }
}

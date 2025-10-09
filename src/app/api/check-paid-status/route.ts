import { respData, respErr } from "@/lib/resp";
import { auth } from "@/auth";
import { isAuthEnabled } from "@/lib/auth";
import { getLatestPaidOrderByUserUuid } from "@/models/order";

export async function GET() {
  try {
    if (!isAuthEnabled()) {
      console.log('[check-paid-status] Auth not enabled');
      return respData({ isPaid: false });
    }

    const session = await auth();
    console.log('[check-paid-status] Session user UUID:', session?.user?.uuid);
    
    if (!session?.user?.uuid) {
      console.log('[check-paid-status] No user UUID in session');
      return respData({ isPaid: false });
    }

    const userUuid = session.user.uuid;
    const paidOrder = await getLatestPaidOrderByUserUuid(userUuid);
    
    console.log('[check-paid-status] Valid paid order found:', paidOrder ? {
      order_no: paidOrder.order_no,
      status: paidOrder.status,
      expired_at: paidOrder.expired_at,
      created_at: paidOrder.created_at
    } : null);
    
    // If we found a valid order (not expired), user is paid
    const isPaid = !!paidOrder;
    
    console.log('[check-paid-status] Result: isPaid =', isPaid);

    return respData({ isPaid });
  } catch (error) {
    console.error("Error checking paid status:", error);
    return respErr("Failed to check paid status");
  }
}

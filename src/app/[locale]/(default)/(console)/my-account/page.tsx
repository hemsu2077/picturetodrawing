import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserCredits } from "@/services/credit";
import { getUserEmail, getUserInfo, getUserUuid } from "@/services/user";
import { getOrdersByUserUuid, getOrdersByPaidEmail } from "@/models/order";
import { getStripeBilling } from "@/services/order";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import Link from "next/link";
import moment from "moment";

export default async function MyAccountPage() {
  const t = await getTranslations();
  
  const user_uuid = await getUserUuid();
  const user_email = await getUserEmail();
  const user_info = await getUserInfo();
  
  const callbackUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/my-account`;
  if (!user_uuid) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  // Get user credits
  const userCredits = await getUserCredits(user_uuid);
  
  // Get user orders
  let orders = await getOrdersByUserUuid(user_uuid);
  if (!orders || orders.length === 0) {
    orders = await getOrdersByPaidEmail(user_email);
  }

  // Determine current plan
  const getCurrentPlan = () => {
    if (!orders || orders.length === 0) {
      return { type: "free", name: "Free", action: "upgrade" };
    }

    const now = new Date();
    const activeOrders = orders.filter(order => {
      if (order.interval === "month" || order.interval === "year") {
        return order.sub_period_end && new Date(order.sub_period_end * 1000) > now;
      }
      return true; // one-time orders are always considered active
    });

    if (activeOrders.length === 0) {
      return { type: "free", name: "Free", action: "upgrade" };
    }

    // Priority: subscription (monthly/yearly) > one-time
    const subscriptions = activeOrders.filter(order => 
      order.interval === "month" || order.interval === "year"
    );

    if (subscriptions.length > 0) {
      // Get the latest subscription
      const latestSub = subscriptions.sort((a, b) => 
        new Date(b.paid_at!).getTime() - new Date(a.paid_at!).getTime()
      )[0];
      
      return {
        type: "subscription",
        name: latestSub.product_name,
        interval: latestSub.interval,
        endDate: latestSub.sub_period_end ? new Date(latestSub.sub_period_end * 1000) : null,
        action: "manage",
        subId: latestSub.sub_id,
        order: latestSub
      };
    }

    // Only one-time orders
    const latestOneTime = activeOrders.sort((a, b) => 
      new Date(b.paid_at!).getTime() - new Date(a.paid_at!).getTime()
    )[0];
    
    return {
      type: "one-time",
      name: latestOneTime.product_name,
      action: "upgrade",
      order: latestOneTime
    };
  };

  const currentPlan = getCurrentPlan();

  const handleSignOut = async () => {
    "use server";
    await signOut({ redirectTo: "/" });
  };

  const renderPlanAction = async () => {
    if (currentPlan.action === "upgrade") {
      return (
        <Link href="/pricing">
          <Button className="bg-primary hover:bg-primary/90 text-white">
            {t("my_account.upgrade")}
          </Button>
        </Link>
      );
    }

    if (currentPlan.action === "manage" && currentPlan.subId) {
      try {
        const billing = await getStripeBilling(currentPlan.subId);
        if (billing && billing.url) {
          return (
            <Link href={billing.url} target="_blank">
              <Button variant="outline">
                {t("my_account.manage_billing")}
              </Button>
            </Link>
          );
        }
      } catch (error) {
        console.error("Failed to get billing URL:", error);
      }
    }

    return (
      <Link href="/pricing">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          {t("my_account.upgrade")}
        </Button>
      </Link>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">{t("my_account.account_management")}</h1>
      
      {/* Profile Information */}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>{t("my_account.profile_information")}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user_info?.avatar_url || ""} />
              <AvatarFallback className="bg-primary text-white text-xl">
                {user_info?.nickname?.charAt(0)?.toUpperCase() || user_email?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">
                {user_info?.nickname || user_email?.split("@")[0] || "User"}
              </h3>
              <p className="text-gray-600">{user_email}</p>
            </div>
          </div>
          <form action={handleSignOut}>
            <Button type="submit" variant="outline">
              {t("my_account.sign_out")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Available Credits */}
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>{t("my_account.available_credits")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-green-600 text-2xl">🌱</span>
              <span className="text-3xl font-bold">{userCredits?.left_credits || 0}</span>
            </div>
            <Link href="/pricing">
              <Button variant="outline" className="w-full">
                {t("my_account.add_credits")}
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Current Plan */}
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>{t("my_account.current_plan")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold">
                {currentPlan.name === "Free" ? t("my_account.free_plan") : currentPlan.name}
              </h3>
              {currentPlan.type === "subscription" && currentPlan.endDate && (
                <p className="text-sm text-gray-600">
                  {t("my_account.valid_until")} {moment(currentPlan.endDate).format("YYYY-MM-DD")}
                </p>
              )}
            </div>
            {await renderPlanAction()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
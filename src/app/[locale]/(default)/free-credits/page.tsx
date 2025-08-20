import DailyCheckin from "@/components/checkin/daily-checkin";
import { auth } from "@/auth";
import { isAuthEnabled } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Free Credits - Picture to Drawing",
    description: "Earn free credits by checking in daily! Complete challenges and get rewarded.",
    robots: {
      index: false,
      follow: false,
    },
  };

export default async function FreeCredits() {
  // Check authentication if enabled
  if (isAuthEnabled()) {
    const session = await auth();
    if (!session?.user?.uuid) {
      redirect("/auth/signin?callbackUrl=/free-credits");
    }
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Free Credits</h1>
          <p className="text-muted-foreground text-lg">
            Earn free credits by checking in daily! Complete challenges and get rewarded.
          </p>
        </div>
        
        <DailyCheckin />
      </div>
    </div>
  );
}
import { Metadata } from "next";
import DailyCheckinTest from "./client";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isAuthEnabled } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Test Checkin - Picture to Drawing",
  description: "Test daily checkin features",
  robots: {
    index: false,
    follow: false,
  },
};

async function TestCheckinPage() {
  // Check if authentication is enabled
  if (isAuthEnabled()) {
    const session = await auth();
    
    // Only allow access if user is authenticated
    if (!session?.user?.email) {
      redirect("/auth/signin");
    }
    
    // Optional: Add additional admin/developer role check
    // You could check for specific email domains or user roles
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
    const isAuthorized = adminEmails.includes(session.user.email);
    
    if (!isAuthorized) {
      redirect("/");
    }
  }

  return <DailyCheckinTest />;
}

export default TestCheckinPage;

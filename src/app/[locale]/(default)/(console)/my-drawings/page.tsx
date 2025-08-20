import { auth } from "@/auth";
import { getImagesByUserUuid } from "@/models/image";
import { redirect } from "next/navigation";
import MyDrawingsClient from "./client";
import { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function MyDrawingsPage() {
  const session = await auth();
  
  if (!session?.user?.uuid) {
    redirect("/auth/signin");
  }

  // Get user's drawings
  const drawings = await getImagesByUserUuid(session.user.uuid, 1, 100);

  return <MyDrawingsClient drawings={drawings || []} />;
}

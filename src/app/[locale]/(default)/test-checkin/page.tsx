import { Metadata } from "next";
import DailyCheckinTest from "./client";

export const metadata: Metadata = {
  title: "Test Checkin - Picture to Drawing",
  description: "Test daily checkin features",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TestCheckinPage() {
  return <DailyCheckinTest />;
}

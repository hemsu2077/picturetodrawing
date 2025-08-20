import { Metadata } from "next";
import DailyCheckinTest from "./client";

export const metadata: Metadata = {
  title: "签到测试 - Picture to Drawing",
  description: "测试每日签到功能的各种场景",
};

export default function TestCheckinPage() {
  return <DailyCheckinTest />;
}

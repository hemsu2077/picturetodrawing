"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Load Sonner's Toaster client-side and only after idle
const DynamicToaster = dynamic(
  () => import("sonner").then((m) => m.Toaster),
  { ssr: false }
);

export default function LazyToaster() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const schedule = (cb: () => void) => {
      const ric: any = (window as any).requestIdleCallback;
      if (typeof ric === "function") {
        return ric(cb, { timeout: 2500 });
      }
      return setTimeout(cb, 1500);
    };

    const cancel = (id: number) => {
      const cic: any = (window as any).cancelIdleCallback;
      if (typeof cic === "function") {
        try {
          cic(id);
        } catch {}
        return;
      }
      clearTimeout(id);
    };

    const id = schedule(() => setShow(true)) as unknown as number;
    return () => cancel(id);
  }, []);

  if (!show) return null;
  return <DynamicToaster position="top-center" richColors />;
}


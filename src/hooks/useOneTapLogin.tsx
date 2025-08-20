"use client";

import googleOneTap from "google-one-tap";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function () {
  const { data: session, status } = useSession();

  const oneTapLogin = async function () {
    try {
      const options = {
        client_id: process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID,
        auto_select: false,
        cancel_on_tap_outside: false,
        context: "signin",
      };

      // console.log("onetap login trigger", options);

      googleOneTap(options, (response: any) => {
        console.log("onetap login ok", response);
        handleLogin(response.credential);
      });
    } catch (error) {
      // silent handle FedCM related errors, these errors usually do not affect user experience
      if (error instanceof Error && error.message.includes('FedCM')) {
        console.debug('FedCM error (expected during logout):', error.message);
      } else {
        console.error("Google One Tap initialization error:", error);
      }
    }
  };

  const handleLogin = async function (credentials: string) {
    const res = await signIn("google-one-tap", {
      credential: credentials,
      redirect: false,
    });
    console.log("signIn ok", res);
  };

  useEffect(() => {
    // console.log("one tap login status", status, session);

    if (status === "unauthenticated") {
      oneTapLogin();

      const intervalId = setInterval(() => {
        oneTapLogin();
      }, 3000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [status]);

  return <></>;
}

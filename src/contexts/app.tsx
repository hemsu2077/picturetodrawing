"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { cacheGet, cacheRemove } from "@/lib/cache";

import { CacheKey } from "@/services/constant";
import { ContextValue } from "@/types/context";
import { User } from "@/types/user";
import moment from "moment";
import useOneTapLogin from "@/hooks/useOneTapLogin";
import { useSession } from "next-auth/react";
import { isAuthEnabled, isGoogleOneTapEnabled } from "@/lib/auth";

const AppContext = createContext({} as ContextValue);

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  if (isAuthEnabled() && isGoogleOneTapEnabled()) {
    useOneTapLogin();
  }

  const { data: session } = isAuthEnabled() ? useSession() : { data: null };

  const [showSignModal, setShowSignModal] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [showPricingModal, setShowPricingModal] = useState<boolean>(false);

  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  const fetchUserInfo = async function () {
    try {
      const resp = await fetch("/api/get-user-info", {
        method: "POST",
      });

      if (!resp.ok) {
        throw new Error("fetch user info failed with status: " + resp.status);
      }

      const { code, message, data } = await resp.json();
      if (code !== 0) {
        throw new Error(message);
      }

      setUser(data);

      updateInvite(data);
    } catch (e) {
      console.log("fetch user info failed");
    }
  };

  const updateInvite = async (user: User) => {
    try {
      if (user.invited_by) {
        // user already been invited
        console.log("user already been invited", user.invited_by);
        return;
      }

      const inviteCode = cacheGet(CacheKey.InviteCode);
      if (!inviteCode) {
        // no invite code
        return;
      }

      const userCreatedAt = moment(user.created_at).unix();
      const currentTime = moment().unix();
      const timeDiff = Number(currentTime - userCreatedAt);

      if (timeDiff <= 0 || timeDiff > 7200) {
        // user created more than 2 hours
        console.log("user created more than 2 hours");
        return;
      }

      // update invite relation
      console.log("update invite", inviteCode, user.uuid);
      const req = {
        invite_code: inviteCode,
        user_uuid: user.uuid,
      };
      const resp = await fetch("/api/update-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
      });
      if (!resp.ok) {
        throw new Error("update invite failed with status: " + resp.status);
      }
      const { code, message, data } = await resp.json();
      if (code !== 0) {
        throw new Error(message);
      }

      setUser(data);
      cacheRemove(CacheKey.InviteCode);
    } catch (e) {
      console.log("update invite failed: ", e);
    }
  };

  useEffect(() => {
    if (session && session.user) {
      fetchUserInfo();
    }
  }, [session]);

  useEffect(() => {
    if (!user || !user.email) return;
    if (typeof window === "undefined") return;

    const w: any = window as any;
    const consent = w.__uetConsentAdStorage || 'denied';
    if (consent !== 'granted') return;
    if (w.__uetEnhancedSent) return;

    try {
      const email = String(user.email || "").trim().toLowerCase();
      const phone = "";
      w.uetq = w.uetq || [];
      w.uetq.push('set', { 'pid': { 'em': email, 'ph': phone } });
      w.__uetEnhancedSent = true;
    } catch (e) {
      // no-op
    }
  }, [user]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const w: any = window as any;
    const handler = (evt: any) => {
      const status = evt?.detail?.ad_storage;
      if (status !== 'granted') return;
      if (!user || !user.email) return;
      if (w.__uetEnhancedSent) return;
      try {
        const email = String(user.email || "").trim().toLowerCase();
        const phone = "";
        w.uetq = w.uetq || [];
        w.uetq.push('set', { 'pid': { 'em': email, 'ph': phone } });
        w.__uetEnhancedSent = true;
      } catch (e) {}
    };
    window.addEventListener('consent:changed', handler as EventListener);
    return () => window.removeEventListener('consent:changed', handler as EventListener);
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        showSignModal,
        setShowSignModal,
        user,
        setUser,
        showPricingModal,
        setShowPricingModal,
        showFeedback,
        setShowFeedback,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

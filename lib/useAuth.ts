// lib/useAuth.ts
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export interface AuthState {
  // Full session after OTP verification
  session: Session | null;
  // True if user is fully authenticated after OTP verification
  isAuthenticated: boolean;
  // True if user requested an OTP but is awaiting verification
  awaitingOtp: boolean;
  // Email of user currently in OTP flow (for passing to verify screen)
  pendingEmail: string | null;
  loading: boolean;
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [awaitingOtp, setAwaitingOtp] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data }: { data: { session: Session | null } }) => {
        if (!mounted) return;
        setSession(data.session ?? null);
        setLoading(false);
      });

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, sess: Session | null) => {
        setSession(sess ?? null);
      },
    );

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const setOtpState = (email: string) => {
    setPendingEmail(email);
    setAwaitingOtp(true);
  };

  const clearOtpState = () => {
    setPendingEmail(null);
    setAwaitingOtp(false);
  };

  return {
    session,
    isAuthenticated: !!session,
    awaitingOtp,
    pendingEmail,
    loading,
    setOtpState,
    clearOtpState,
  };
}

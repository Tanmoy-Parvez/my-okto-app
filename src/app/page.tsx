/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useMemo } from "react";
import { useSession, signOut } from "next-auth/react";

import { getAccount, useOkto } from "@okto_web3/react-sdk";
import { LoginButton } from "@/components/LoginButton";
import GetButton from "@/components/GetButton";

export default function Home() {
  const { data: session } = useSession();
  const oktoClient = useOkto();

  //@ts-expect-error session is not defined
  const idToken = useMemo(() => (session ? session.id_token : null), [session]);

  async function handleAuthenticate(): Promise<any> {
    if (!idToken) {
      return { result: false, error: "No google login" };
    }
    const user = await oktoClient.loginUsingOAuth({
      idToken: idToken,
      provider: "google",
    });
    console.log("Authentication Success", user);
    return JSON.stringify(user);
  }

  async function handleLogout() {
    try {
      signOut();
      return { result: "logout success" };
    } catch (error: any) {
      console.error(error);
      return { result: "logout failed" };
    }
  }

  useEffect(() => {
    if (idToken) {
      handleAuthenticate();
    }
  }, [idToken]);

  return (
    <main className="flex min-h-screen flex-col items-center space-y-6 p-12 bg-violet-200">
      <div className="text-black font-bold text-3xl mb-8">Template App</div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-lg mt-8">
        <LoginButton />
        <GetButton title="Okto Log out" apiFn={handleLogout} />
        <GetButton title="getAccount" apiFn={getAccount} />
      </div>
    </main>
  );
}

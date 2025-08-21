"use client";
import { generateToast } from "../../_global_components/generateToast";
import GoogleSignInButton from "../../_global_components/GoogleSignIn";
import { useState } from "react";

export default function Home() {
  const [isPending, setIsPending] = useState<boolean>(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <div className="flex flex-col items-center gap-8 p-10 rounded-2xl shadow-lg bg-white w-full">
        <h3 className="font-[600] text-[28px] text-[#e0b88f]">
          Sign in to continue
        </h3>
        <GoogleSignInButton />
        <p className="text-[12px] font-[500] text-gray-400 text-center">
          Use your Google account to log in
        </p>
      </div>
    </div>
  );
}

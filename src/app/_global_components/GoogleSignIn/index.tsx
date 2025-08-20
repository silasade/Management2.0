"use client";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "../icons";

export default function GoogleSignInButton() {
  const signInWithGoogle = () => {
    // Navigate the browser instead of fetch
    window.location.href = "/api/auth/signin-with-google";
  };

  return (
    <Button
      variant="outline"
      type="button"
      onClick={signInWithGoogle}
      className="bg-none rounded-[8px] cursor-pointer text-[14px] w-full h-[45px] text-[#d4a373] font-[500]"
    >
      <GoogleIcon /> Continue with Google
    </Button>
  );
}

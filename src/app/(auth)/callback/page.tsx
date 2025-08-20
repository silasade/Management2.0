"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error(error.message);
      } else {
        // redirect to home or dashboard
        router.push("/");
      }
    };

    getSession();
  }, [router]);

  return <p>Loading...</p>;
}

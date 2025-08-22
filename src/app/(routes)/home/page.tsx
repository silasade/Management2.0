"use client";

import React, { useEffect, useState } from "react";
import s from "./home.module.scss";
import Card from "./_local_components/Card";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useGetUserDetails } from "@/lib/actions/user";
import { generateToast } from "@/app/_global_components/generateToast";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const { data } = useGetUserDetails();
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  return (
    <div className={s.wrapper}>
      <div className={s.head}>
        <h3 className={s.name}>
          Welcome, {user?.user_metadata?.given_name ?? user?.user_metadata?.firstName}
        </h3>
        <button className={s.createBtn}>
          <Link
            href={"/home/create-event"}
            onClick={() => {
              if (!data?.provider_token) {
                generateToast(
                  "error",
                  "Please login with google to create an event"
                );
                window.location.href = "/api/auth/signin-with-google";
              } else {
              }
            }}
          >
            Create event
          </Link>
        </button>
      </div>
      <div className={s.cardWrapper}>
        <div className={s.card}>
          <h3 className={s.label}>Total Events</h3>
          <p className={s.stat}>20</p>
        </div>
        <Card label="Completed Events" stat={10} />
        <Card label="Upcoming Events" stat={10} />
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import s from "./home.module.scss";
import Card from "./_local_components/Card";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useGetUserDetails } from "@/lib/actions/user";
import { generateToast } from "@/app/_global_components/generateToast";
import { useRouter } from "next/navigation";
import { useGetAllEvents, useGetEventStatistics } from "@/lib/actions/event";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const router = useRouter();
  const { isLoading, data: eventStat } = useGetEventStatistics();
  const [user, setUser] = useState<any>(null);
  const { data } = useGetUserDetails();
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  return (
    <div className={s.wrapper}>
      <div className={s.head}>
        <h3 className={s.name}>
          Welcome,{" "}
          {user?.user_metadata?.given_name ?? user?.user_metadata?.firstName}
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
        {isLoading ? (
          <Skeleton className="w-100 h-[120px]" />
        ) : (
          <div className={s.card}>
            <h3 className={s.label}>Total Events</h3>
            <p className={s.stat}>{eventStat?.totalEvents}</p>
          </div>
        )}
        {isLoading ? (
          <Skeleton className="w-100 h-[120px] rounded-[8px]" />
        ) : (
          <Card
            label="Completed Events"
            stat={eventStat?.completedEvents ?? 0}
          />
        )}
        {isLoading ? (
          <Skeleton className="w-100 h-[120px] rounded-[8px]" />
        ) : (
          <Card
            label="Upcoming Events"
            stat={eventStat?.upcomingEvents ?? 0}
          />
        )}
      </div>
    </div>
  );
}

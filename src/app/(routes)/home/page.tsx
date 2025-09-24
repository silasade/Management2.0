"use client";

import React from "react";
import s from "./home.module.scss";
import Card from "./_local_components/Card";
import Link from "next/link";
import { useGetUserDetails } from "@/lib/actions/user";
import { useRouter } from "next/navigation";
import { useGetEventStatistics } from "@/lib/actions/event";
import { Skeleton } from "@/components/ui/skeleton";
import EventsData from "./_local_components/EventsData";

export default function Dashboard() {
  const router = useRouter();
  const { isLoading, data: eventStat } = useGetEventStatistics();
  const { data, isLoading: isfetchingUser } = useGetUserDetails();
  return (
    <div className={s.wrapper}>
      <div className={s.head}>
        {isfetchingUser ? (
          <Skeleton className="w-[100px] h-[20px]  bg-gray-300 animate-pulse" />
        ) : (
          <h3 className={s.name}>Welcome, {data?.firstName || "user"}</h3>
        )}
        <Link href={"/home/create-event"} className={s.createBtn}>
          Create event
        </Link>
      </div>
      <div className={s.cardWrapper}>
        {isLoading ? (
          <Skeleton className="w-100 h-[120px]  bg-gray-300 animate-pulse" />
        ) : (
          <div className={s.card}>
            <h3 className={s.label}>Total Events</h3>
            <p className={s.stat}>{eventStat?.totalEvents}</p>
          </div>
        )}
        {isLoading ? (
          <Skeleton className="w-100 h-[120px] rounded-[8px]  bg-gray-300 animate-pulse" />
        ) : (
          <Card
            label="Completed Events"
            stat={eventStat?.completedEvents ?? 0}
          />
        )}
        {isLoading ? (
          <Skeleton className="w-100 h-[120px] rounded-[8px]  bg-gray-300 animate-pulse" />
        ) : (
          <Card label="Upcoming Events" stat={eventStat?.upcomingEvents ?? 0} />
        )}
      </div>
      <div className={s.tableWrapper}>
        <h4 className={s.tableTitle}>Events</h4>
        <EventsData />
      </div>
    </div>
  );
}

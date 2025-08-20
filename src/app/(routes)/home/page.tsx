"use client";

import React, { useEffect, useState } from "react";
import s from "./home.module.scss";
import Card from "./_local_components/Card";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  return (
    <div className={s.wrapper}>
      <div className={s.head}>
        <h3 className={s.name}>
          Welcome, {user?.user_metadata?.firstName ?? "Guest"}
        </h3>
        <button className={s.createBtn}>
          <Link href={"/home/create-event"}>Create event</Link>
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

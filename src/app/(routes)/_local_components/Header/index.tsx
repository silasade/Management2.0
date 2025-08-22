"use client";
import React, { useEffect, useState } from "react";
import s from "./Header.module.scss";
import { AvatarIcon } from "@/app/_global_components/icons";
import { supabase } from "@/lib/supabase";
import { useGetUserDetails } from "@/lib/actions/user";

function Header() {
  const { data, isLoading } = useGetUserDetails();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  return (
    <div className={s.wrapper}>
      <div className={s.profileInfo}>
        <AvatarIcon className={s.icon} />
        <span className={s.profileDetails}>
          <h5 className={s.name}>
            {user?.user_metadata?.given_name +
              " " +
              user.user_metadata?.family_name}
          </h5>
          <p className={s.email}>{data?.email}</p>
        </span>
      </div>
    </div>
  );
}

export default Header;

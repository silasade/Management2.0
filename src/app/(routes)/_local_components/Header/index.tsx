"use client";
import React, { useEffect, useState } from "react";
import s from "./Header.module.scss";
import { AvatarIcon } from "@/app/_global_components/icons";
import { supabase } from "@/lib/supabase";
import { useGetUserDetails } from "@/lib/actions/user";
import { Skeleton } from "@/components/ui/skeleton";

function Header() {
  const { data, isLoading } = useGetUserDetails();

  return (
    <div className={s.wrapper}>
      <div className={s.profileInfo}>
        {isLoading ? (
          <Skeleton className="w-[40px] h-[40px] rounded-[100%]  bg-gray-300 animate-pulse" />
        ) : (
          <AvatarIcon className={s.icon} />
        )}
        <span className={s.profileDetails}>
          {isLoading ? (
            <Skeleton className="w-[70px] h-[10px]   bg-gray-300 animate-pulse" />
          ) : (
            <h5 className={s.name}>
              {(data?.firstName || "") + " " + (data?.lastName || "")}
            </h5>
          )}
          {isLoading ? (
            <Skeleton className="w-[80px] h-[10px]   bg-gray-300 animate-pulse" />
          ) : (
            <p className={s.email}>{data?.email}</p>
          )}
        </span>
      </div>
    </div>
  );
}

export default Header;

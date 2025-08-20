"use client";
import React, { useState } from "react";
import s from "./Sidebar.module.scss";
import Link from "next/link";
import { ExitIcon } from "@/app/_global_components/icons";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { generateToast } from "@/app/_global_components/generateToast";
import { ColorRing, Rings } from "react-loader-spinner";
import { useGetUserDetails } from "@/lib/actions/user";

function Sidebar() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const pathName = usePathname();
  const logout = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/sign-out", {
        method: "POST",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error ?? "Logout failed");
      }
      router.push("/");
      generateToast("success", "Logout successful!");
    } catch (error) {
      generateToast("error", (error as Error).message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={s.wrapper}>
      <div className={s.head}></div>
      <div className={s.content}>
        <Link
          href={"/home"}
          className={clsx(s.link, { [s.active]: pathName.includes("/home") })}
        >
          Home
        </Link>
        <button onClick={logout}>
          {loading && (
            <ColorRing
              visible={true}
              height="20"
              width="20"
              ariaLabel="color-ring-loading"
              wrapperStyle={{}}
              wrapperClass="color-ring-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          )}
          Logout <ExitIcon />
        </button>
      </div>
    </div>
  );
}

export default Sidebar;

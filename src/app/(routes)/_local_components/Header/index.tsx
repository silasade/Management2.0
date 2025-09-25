"use client";
import React, { useEffect, useState } from "react";
import s from "./Header.module.scss";
import { ArrowDownIcon, AvatarIcon } from "@/app/_global_components/icons";
import { useGetUserDetails } from "@/lib/actions/user";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { generateToast } from "@/app/_global_components/generateToast";
function Header() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { data, isLoading } = useGetUserDetails();
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <ArrowDownIcon width={24} height={24} />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-sm">
                Are you sure you want to log out?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs">
                  You will be signed out of your account and will need to log in
                  again to continue using the app.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex flex-row justify-center w-full">
              <AlertDialogCancel className="W-full">Cancel</AlertDialogCancel>
              <AlertDialogAction className="W-full" onClick={logout}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default Header;

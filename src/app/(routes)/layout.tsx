import React from "react";
import s from "./layout.module.scss";
import Header from "./_local_components/Header";
import { Toaster } from "@/components/ui/sonner";

type PropType = {
  children: React.ReactNode;
};
function layout({ children }: PropType) {
  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <Header />
      </div>
      <Toaster />

      <div className={s.dashboard}>{children}</div>
    </div>
  );
}

export default layout;

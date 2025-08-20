import React from "react";
import s from "./layout.module.scss";
import Header from "./_local_components/Header";
import Sidebar from "./_local_components/Sidebar";
type PropType = {
  children: React.ReactNode;
};
function layout({ children }: PropType) {
  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <Header />
      </div>
      <aside className={s.sidebar}>
        <Sidebar />
      </aside>
      <div className={s.dashboard}>{children}</div>
    </div>
  );
}

export default layout;

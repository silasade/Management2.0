import React from "react";
import s from "./layout.module.scss";
type PropType = {
  children: React.ReactNode;
};
function AuthLayout({ children }: PropType) {
  return (
    <div className={s.wrapper}>
      <div className={s.authPage}>{children}</div>
      <div className={s.info}>
        <h1></h1>
        <p className="text-[40px] text-[#e0b88f] font-[700] text-right">
          Smart Event Organizer: AI-Driven Image-to-Calendar Automation
        </p>
      </div>
    </div>
  );
}

export default AuthLayout;

import React from "react";
import s from "./NoData.module.scss";
type NodataProp = {
  icon: React.ReactNode;
  Message: string;
  subMessage: string;
};
function NoData({ icon, Message, subMessage }: NodataProp) {
  return (
    <div className={s.wrapper}>
      <div>{icon}</div>
      <div>
        <h5 className={s.title}>{Message}</h5>
        <h6 className={s.subtitle}>{subMessage}</h6>
      </div>
    </div>
  );
}

export default NoData;

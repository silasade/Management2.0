import React from "react";
import s from "./Card.module.scss";
type PropType = {
  label: string;
  stat: number;
};
function Card({ label, stat }: PropType) {
  return (
    <div className={s.wrapper}>
      <h3 className={s.label}>{label}</h3>
      <p className={s.stat}>{stat}</p>
    </div>
  );
}

export default Card;

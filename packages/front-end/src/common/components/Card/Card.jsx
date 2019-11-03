import React from "react";
import styles from "./Card.module.scss";

export default function Card({ children, classNames, color }) {
  return (
    <div className={[styles.card, classNames, color].join(" ")}>
      {children && children}
    </div>
  );
}

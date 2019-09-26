import React from "react";
import styles from "./Card.module.scss";

export default function Card({ children, classNames }) {
  return (
    <div className={[styles.card, classNames]}>{children && children}</div>
  );
}

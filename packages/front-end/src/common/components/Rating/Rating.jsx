import React from "react";
import styles from "./Rating.module.scss";

export default function Rating({ selected = false, onClick, key }) {
  return (
    <div
      key={key}
      className={
        selected ? [styles.star, styles.selected].join(" ") : styles.star
      }
      onClick={onClick}
    />
  );
}

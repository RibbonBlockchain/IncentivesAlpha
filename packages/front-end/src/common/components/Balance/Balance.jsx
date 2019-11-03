import React from "react";
import styles from "./Balance.module.scss";

export default function Balance({ balance, ticker }) {
  return `${balance} ${balance && ticker}`;
}

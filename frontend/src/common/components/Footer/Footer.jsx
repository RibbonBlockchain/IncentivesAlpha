import React from "react";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.admin__footer}>
      <ul className={styles.ticker}></ul>
      <span>&copy; 2019 RibbonBlockchain PTY.</span>
    </footer>
  );
}

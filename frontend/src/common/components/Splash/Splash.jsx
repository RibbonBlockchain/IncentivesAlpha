import React from "react";

import Logo from "../Logo";

import styles from "./Splash.module.scss";

function Splash({ alt }) {
  return (
    <div className={styles.loader}>
      <Logo />
      <span>{alt}</span>
    </div>
  );
}

export default Splash;

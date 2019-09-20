import React from "react";
import ReactImageFallback from "react-image-fallback";

import logoImage from "../../assets/logo.svg";

import styles from "./Logo.module.scss";

function Logo() {
  return (
    <>
      <ReactImageFallback
        src={logoImage}
        fallbackImage={logoImage}
        initialImage={logoImage}
        alt="Ribbon Blockchain Company Logo"
        className={styles.logo}
      />
    </>
  );
}

export default Logo;

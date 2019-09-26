import React from "react";
import styles from "./User.module.scss";

export default function User({ onClick }) {
  return (
    <>
      <div className={styles.address} onClick={onClick}>
        {/* Todo show address as 0x00000...0000 */}
        <p>0x9A8A9958ac1B70c49ccE9693CCb0230f13F63505</p>
      </div>
    </>
  );
}

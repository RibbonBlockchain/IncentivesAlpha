import React from "react";
import styles from "./User.module.scss";
import Blockies from "../Blockies";
import { formatAddress } from "../../utils";

export default function User({ onClick, address }) {
  return (
    <>
      <div className={styles.address} onClick={onClick}>
        <>
          <Blockies
            className={styles.avatar}
            address={address}
            imageSize={30}
          />
          <small>{formatAddress(address)}</small>
        </>
      </div>
    </>
  );
}

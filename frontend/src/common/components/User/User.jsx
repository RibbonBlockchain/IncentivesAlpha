import React from "react";
import styles from "./User.module.scss";
import Blockies from "../Blockies";
import { getItem } from "../../utils/storage";
import { formatAddress } from "../../utils";

export default function User({ onClick, address }) {
  return (
    <div className={styles.address} onClick={onClick}>
      <Blockies
        className={styles.avatar}
        address={getItem("address")}
        imageSize={30}
      />
      <small>{formatAddress(address)}</small>
    </div>
  );
}

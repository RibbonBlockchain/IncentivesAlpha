import React from "react";
import styles from "./TransactionStatus.module.scss";
import loadingSpinner from "../../common/assets/loading_spinner.svg";
import { useTransactionStatus } from "../../common/providers/TransactionStatus.provider";

export default function TransactionStatus() {
  const [
    { dappTx, published, failed, progress },
    ,
    closeTransactionStatus
  ] = useTransactionStatus();
  return (
    <>
      <div className={`${styles.cnt} ${dappTx ? styles.active : ""}`}>
        <div className={styles.data}>
          {published && (
            <div className={styles.status}>
              ✓ Your blockchain action has been recorded successfully
            </div>
          )}
          {progress && (
            <div className={styles.status}>
              <img src={loadingSpinner} alt="Loading..." />
              Waiting for confirmation from Ethereum...
            </div>
          )}
          {failed && (
            <div className={`${styles.status} ${styles.red} ${styles.column}`}>
              Transaction failed. Please check EtherScan for tx:{" "}
              <span>{dappTx}</span>
            </div>
          )}
          <div className={styles.name}>
            <div className={styles.close} onClick={closeTransactionStatus}>
              +
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

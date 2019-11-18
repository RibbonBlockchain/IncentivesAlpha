import React from "react";
import * as moment from "moment";
import Modal from "../../../common/components/Modal";
import { useModal } from "../../../common/providers/Modal.provider";
import { useWeb3 } from "../../../common/providers/Web3.provider";
import { useApp } from "../../../common/providers/App.provider";
import styles from "./View.module.scss";

function ViewInteractionModal({ data: { data }, currency, type }) {
  return (
    <div className={styles.container}>
      <div className={styles.wallet}>
        <small>Transaction Datetime: </small>
        <strong>
          {`${moment(data.createdDate).format(
            "dddd, Do MMMM YYYY"
          )} at ${moment(data.createdDate).format("hh:mm:ss")}`}
        </strong>
      </div>
      <div className={styles.description}>
        <span className={styles.heading}>
          Total Amount Sent:{" "}
          {`${
            data.transactionLog.txn_amount
              ? data.transactionLog.txn_amount
              : "Not available"
          } ${data.transactionLog.txn_amount ? currency : ""}`}
        </span>
        <span className={styles.wrapper}></span>
      </div>
      <div className={styles.status}>
        <span className={styles.wrapper}>
          Transaction Status:{" "}
          {data.transactionLog.status === 0 ? "Successful" : "Failed"}
        </span>
      </div>
      {data.transactionLog.txn_hash && (
        <div className={styles.description}>
          <span className={styles.heading}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className={[styles.link].join(" ")}
              href={`https://blockscout.com/poa/sokol/tx/${data.transactionLog.txn_hash}`}
            >
              View Transaction
            </a>
          </span>
        </div>
      )}
    </div>
  );
}
function UserDetails() {
  const [{ isVisible, data, modal }, toggleModal] = useModal();
  const [{ loginType, balance }] = useWeb3();
  const [{ currency }] = useApp();

  function onClickClose() {
    toggleModal({
      isVisible: false,
      data: null,
      modal: null
    });
  }

  let isOpen = isVisible && modal === "interaction_details";
  let details = {
    balance,
    role: loginType
  };
  return (
    <Modal
      visible={isOpen}
      onClickClose={onClickClose}
      windowClassName={styles.modalWindow}
    >
      <div className={styles.cnt}>
        <ViewInteractionModal
          type={loginType}
          user={details}
          data={data}
          currency={currency}
        />
      </div>
    </Modal>
  );
}

export default UserDetails;

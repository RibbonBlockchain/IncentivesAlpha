import React from "react";
import * as moment from "moment";
import Modal from "../../../common/components/Modal";
import { useModal } from "../../../common/providers/Modal.provider";
import { useWeb3 } from "../../../common/providers/Web3.provider";
import { useApp } from "../../../common/providers/App.provider";
import styles from "./View.module.scss";

function ViewInteractionModal({ data: { data }, currency, type }) {
  function getRatingScore(data) {
    return `${parseFloat(
      (Object.values(data).reduce((acc, curVal) => acc + curVal, 0) / 30) * 100
    ).toFixed(2)}%`;
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>Interaction Number: {data._id}</div>
      <div className={styles.flex}>
        <div className={styles.title}>
          Patient:{" "}
          {data.patient
            ? `${data.patient.firstName} ${data.patient.lastName}`
            : "Not available"}
        </div>
        <div className={styles.description}>
          <span className={styles.heading}>
            Tokens earned:{" "}
            {`${Number(data.rewards[0].patientReward).toFixed(4)} ${
              data.rewards[0].patientReward ? currency : ""
            }`}
          </span>
          <span className={styles.heading}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className={[styles.link].join(" ")}
              href={
                data.patient &&
                `https://blockscout.com/poa/sokol/address/${data.patient.publicAddress}`
              }
            >
              View Address
            </a>
          </span>
        </div>
      </div>
      <div className={styles.flex}>
        <div className={styles.title}>
          Practitioner:{" "}
          {`${data.practitioner.firstName} ${data.practitioner.lastName}`}
        </div>
        <div className={styles.description}>
          <span className={styles.heading}>
            Tokens earned:{" "}
            {`${Number(data.rewards[0].practitionerReward).toFixed(4)} ${
              data.rewards[0].practitionerReward ? currency : ""
            }`}
          </span>
          <span>
            Ratings received: {getRatingScore(data.serviceRatings[0])}
          </span>
          <span className={styles.heading}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className={[styles.link].join(" ")}
              href={`https://blockscout.com/poa/sokol/address/${data.practitioner.publicAddress}`}
            >
              View Address
            </a>
          </span>
        </div>
      </div>
      <div className={styles.flex}>
        <div className={styles.title}>
          Community Health Worker:{" "}
          {`${data.chw.firstName} ${data.chw.lastName}`}
        </div>
        <div className={styles.description}>
          <span className={styles.heading}>
            Tokens earned:{" "}
            {`${Number(data.rewards[0].chwReward).toFixed(4)} ${
              data.rewards[0].chwReward ? currency : ""
            }`}
          </span>
          <span className={styles.heading}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className={[styles.link].join(" ")}
              href={`https://blockscout.com/poa/sokol/address/${data.chw.publicAddress}`}
            >
              View Address
            </a>
          </span>
        </div>
      </div>
      <div className={styles.flex}>
        <div className={styles.title}>Interactions recorded</div>
        <div className={styles.description}>
          {data.activities.map(activity => activity.activityTitle).join(", ")}
        </div>
      </div>
      <div className={styles.wallet}>
        <small>
          Created{" "}
          {`${moment(data.createdDate).format(
            "dddd, Do MMMM YYYY"
          )} at ${moment(data.createdDate).format("hh:mm:ss A")}`}
        </small>
        <small>
          Status{" "}
          {`${data.transactionLog.status === 0 ? "Successful" : "Failed"}`}
        </small>
        <a
          target="_blank"
          rel="noopener noreferrer"
          className={[styles.link].join(" ")}
          href={`https://blockscout.com/poa/sokol/address/${data.transactionLog.txn_hash}`}
        >
          View Transaction
        </a>
      </div>
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

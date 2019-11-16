import React from "react";
import * as moment from "moment";
import Modal from "../../common/components/Modal";
import Blockies from "../../common/components/Blockies";
import Balance from "../../common/components/Balance";
import { roles } from "../../common/constants/roles";
import { useModal } from "../../common/providers/Modal.provider";
import { useWeb3 } from "../../common/providers/Web3.provider";
import { useApp } from "../../common/providers/App.provider";
import styles from "./User.module.scss";

function Profile({ user, data, currency }) {
  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        {user.address && (
          <Blockies
            className={styles.blockies}
            address={user.address}
            imageSize={40}
          />
        )}
      </div>
      <div className={styles.information}>
        <h4
          className={styles.header}
        >{`${data.lastname} ${data.firstname}`}</h4>
        <span className={styles.heading}>
          Logged in as: <strong>{roles[user.role].replace("_", " ")}</strong>
        </span>
        <div className={styles.wallet}>
          <small>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://blockscout.com/poa/sokol/address/${data.publicaddress}`}
            >
              {data.publicaddress}
            </a>
          </small>
          <>
            <Balance
              balance={Number(user.balance).toFixed(4)}
              ticker={currency.toString().toUpperCase()}
            />
          </>
        </div>
        <div className={styles.description}>
          <span className={styles.heading}>Bio</span>
          <span className={styles.wrapper}>{user.bio || "Not available"}</span>
        </div>
        <div className={styles.dob}>
          <span className={styles.heading}>Date of Birth</span>
          <span className={styles.wrapper}>
            {moment(data.dateofbirth).format("DD/MM/YYYY")}
          </span>
        </div>
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

  let isOpen = isVisible && modal === "details";
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
        <Profile user={details} data={data} currency={currency} />
      </div>
    </Modal>
  );
}

export default UserDetails;

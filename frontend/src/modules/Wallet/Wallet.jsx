import React from "react";
import Modal from "../../common/components/Modal";
import Blockies from "../../common/components/Blockies";
import Button from "../../common/components/Button";
import Balance from "../../common/components/Balance";
import { roles } from "../../common/constants/roles";
import { clear } from "../../common/utils/storage";
import { useModal } from "../../common/providers/Modal.provider";
import { useWeb3 } from "../../common/providers/Web3.provider";
import { useApp } from "../../common/providers/App.provider";
import * as moment from "moment";
import styles from "./Wallet.module.scss";
import { withRouter } from "react-router-dom";

function Profile({ user, data, handleProfileNavigation, currency }) {
  async function handleSignOut() {
    clear();
    window.location.reload();
  }
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
          <span>
            <Balance
              balance={Number(user.balance).toFixed(4)}
              ticker={currency.toString().toUpperCase()}
            />
          </span>
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
      <div className={styles.actions}>
        <Button
          classNames={[styles.button, styles.button_primary].join(" ")}
          text="Edit Profile"
          onClick={handleProfileNavigation}
        />
        <Button
          classNames={[styles.button].join(" ")}
          text="Sign out"
          onClick={handleSignOut}
        />
      </div>
    </div>
  );
}
function Wallet({ history }) {
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

  function handleProfileNavigation() {
    onClickClose();
    history.push("/app/profile");
  }

  let isOpen = isVisible && modal === "wallet";
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
        <Profile
          user={details}
          data={data}
          currency={currency}
          handleProfileNavigation={handleProfileNavigation}
        />
      </div>
    </Modal>
  );
}

export default withRouter(Wallet);

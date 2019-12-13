import React from "react";
import * as moment from "moment";
import { withRouter } from "react-router-dom";
import Modal from "../../common/components/Modal";
import Blockies from "../../common/components/Blockies";
import Button from "../../common/components/Button";
import { roles } from "../../common/constants/roles";
import { clear } from "../../common/utils/storage";
import { useModal } from "../../common/providers/Modal.provider";
import { useWeb3 } from "../../common/providers/Web3.provider";
import { useExchange } from "../../common/providers/Rates.provider";
import styles from "./Wallet.module.scss";

function Profile({
  user,
  data,
  handleProfileNavigation,
  showSendModal,
  showQRCodeModal,
  rate
}) {
  async function handleSignOut() {
    clear();
    if (
      window.web3 &&
      window.web3.currentProvider &&
      window.web3.currentProvider.close
    ) {
      await window.web3.currentProvider.close();
    }
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
          <>
            <span>{Number(user.balance * rate).toFixed(4)} ZAR</span>
            <div className={styles.actions}>
              <Button
                classNames={[
                  styles.button,
                  styles.button_small,
                  styles.button_primary
                ].join(" ")}
                text="Send"
                onClick={showSendModal}
              />
              <Button
                classNames={[
                  styles.button,
                  styles.button_small,
                  styles.button_primary
                ].join(" ")}
                text="Receive"
                onClick={showQRCodeModal}
              />
            </div>
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
  const [{ exchangeRate }] = useExchange();

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

  function handleSendWalletModal() {
    toggleModal({
      isVisible: true,
      data: null,
      modal: "send"
    });
  }

  function handleQRCodeModal() {
    toggleModal({
      isVisible: true,
      data: {
        details: {
          publicAddress: data.publicaddress,
          type: "receive"
        },
        message: ""
      },
      modal: "qr"
    });
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
          rate={exchangeRate}
          showQRCodeModal={handleQRCodeModal}
          showSendModal={handleSendWalletModal}
          handleProfileNavigation={handleProfileNavigation}
        />
      </div>
    </Modal>
  );
}

export default withRouter(Wallet);

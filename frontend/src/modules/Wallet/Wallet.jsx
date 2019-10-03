import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../common/components/Modal";
import Blockies from "../../common/components/Blockies";
import Button from "../../common/components/Button";
import Balance from "../../common/components/Balance";
import { HIDE_WALLET } from "../../common/constants/wallet";
import { clear } from "../../common/utils/storage";
import styles from "./Wallet.module.scss";

function Profile({ history }) {
  const dispatch = useDispatch();
  let ticker = "USD";
  let data = {
    address: "0x9A8A9958ac1B70c49ccE9693CCb0230f13F63505",
    firstName: "Nnachi",
    lastName: "Onuwa",
    dob: "November 23rd",
    balance: "0.0"
  };

  async function handleProfileNavigation() {
    await dispatch({
      type: HIDE_WALLET
    });
    history.push("/app/profile");
  }

  async function handleSignOut() {
    clear();
    window.location.reload();
  }
  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        {data.address && (
          <Blockies
            className={styles.blockies}
            address={data.address}
            imageSize={40}
          />
        )}
      </div>
      <div className={styles.information}>
        <h4
          className={styles.header}
        >{`${data.lastName} ${data.firstName}`}</h4>
        <div className={styles.wallet}>
          <small>{data.address}</small>
          <span>
            <Balance balance={data.balance} ticker={ticker} />
          </span>
        </div>
        <div className={styles.description}>
          <span className={styles.heading}>Bio</span>
          <span className={styles.wrapper}>{data.bio || "Not available"}</span>
        </div>
        <div className={styles.dob}>
          <span className={styles.heading}>Date of Birth</span>
          <span className={styles.wrapper}>{data.dob}</span>
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
export default function Wallet({ history }) {
  const { visible } = useSelector(state => state.wallet);
  const dispatch = useDispatch();

  function onClickClose() {
    dispatch({
      type: HIDE_WALLET
    });
  }

  return (
    <Modal
      visible={visible}
      onClickClose={onClickClose}
      windowClassName={styles.modalWindow}
    >
      <div className={styles.cnt}>
        <Profile history={history} />
      </div>
    </Modal>
  );
}

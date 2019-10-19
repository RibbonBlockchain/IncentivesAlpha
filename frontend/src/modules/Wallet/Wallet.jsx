import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../common/components/Modal";
import Blockies from "../../common/components/Blockies";
import Button from "../../common/components/Button";
import Balance from "../../common/components/Balance";
import { roles } from "../../common/constants/roles";
import { HIDE_WALLET } from "../../common/constants/wallet";
import { clear, getItem } from "../../common/utils/storage";
import styles from "./Wallet.module.scss";

function Profile({ history, user }) {
  const dispatch = useDispatch();
  let ticker = "USD";

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
        >{`${user.lastName} ${user.firstName}`}</h4>
        <span className={styles.heading}>
          Logged In as: <strong>{roles[user.role].replace("_", " ")}</strong>
        </span>
        <div className={styles.wallet}>
          <small>{user.address}</small>
          <span>
            <Balance balance={user.balance} ticker={ticker} />
          </span>
        </div>
        <div className={styles.description}>
          <span className={styles.heading}>Bio</span>
          <span className={styles.wrapper}>{user.bio || "Not available"}</span>
        </div>
        <div className={styles.dob}>
          <span className={styles.heading}>Date of Birth</span>
          <span className={styles.wrapper}>{user.dob}</span>
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
  const { user } = useSelector(state => state.user);
  const dispatch = useDispatch();

  function onClickClose() {
    dispatch({
      type: HIDE_WALLET
    });
  }

  let isOpen = visible && user;
  let data = {
    ...user,
    balance: "0.0",
    role: getItem("loginType")
  };

  return (
    <Modal
      visible={isOpen}
      onClickClose={onClickClose}
      windowClassName={styles.modalWindow}
    >
      <div className={styles.cnt}>
        <Profile history={history} user={data} />
      </div>
    </Modal>
  );
}

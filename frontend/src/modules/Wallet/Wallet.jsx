import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../common/components/Modal";

import { HIDE_WALLET } from "../../common/constants/wallet";
import styles from "./Wallet.module.scss";

export default function Wallet() {
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
        <p>Wallet address</p>
      </div>
    </Modal>
  );
}

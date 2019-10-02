import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import QRCode from "qrcode.react";
import Modal from "../../common/components/Modal";
import Button from "../../common/components/Button";
import { HIDE_QR_REGISTRATION_MODAL } from "../../common/constants/qr";
import styles from "./QR.module.scss";

function QRCodeWallet({ wallet }) {
  return (
    <>
      <div className={styles.header}>
        <h3>Share this QR Code with the Community Health Worker</h3>
        <QRCode renderAs="svg" value={wallet} />
      </div>
    </>
  );
}

export default function RegisterWithQR({ history }) {
  const [qrCode, setQRCode] = useState(false);
  const { visible, message } = useSelector(state => state.qrRegistration);
  const dispatch = useDispatch();

  function showQRCode() {
    setQRCode(true);
  }

  function closeModal() {
    dispatch({
      type: HIDE_QR_REGISTRATION_MODAL
    });
    setQRCode(false);
  }

  return (
    <Modal
      visible={visible}
      windowClassName={styles.modalWindow}
      onClickClose={qrCode && closeModal}
    >
      <div className={styles.cnt}>
        {qrCode && (
          <div className={styles.qrWallet}>
            <QRCodeWallet wallet={message} />
          </div>
        )}
        <div className={styles.container}>
          <Button
            disabled={qrCode ? true : false}
            classNames={[styles.button, styles.button_primary].join(" ")}
            text="Register with Health Worker"
            onClick={showQRCode}
          />
        </div>
      </div>
    </Modal>
  );
}

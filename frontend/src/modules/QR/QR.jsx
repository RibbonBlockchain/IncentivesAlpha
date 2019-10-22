import React, { useState } from "react";
import QRCode from "qrcode.react";
import { useModal } from "../../common/providers/Modal.provider";
import Modal from "../../common/components/Modal";
import Button from "../../common/components/Button";
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

export default function RegisterWithQR() {
  const [qrCode, setQRCode] = useState(false);
  const [{ isVisible, data, modal }, toggle] = useModal();

  function showQRCode() {
    setQRCode(true);
  }

  function closeModal() {
    toggle({
      isVisible: false,
      message: null
    });
    setQRCode(false);
  }

  return (
    <Modal
      visible={isVisible && modal === "qr"}
      windowClassName={styles.modalWindow}
      onClickClose={qrCode && closeModal}
    >
      <div className={styles.cnt}>
        {qrCode && (
          <div className={styles.qrWallet}>
            <QRCodeWallet wallet={data.publicAddress} />
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

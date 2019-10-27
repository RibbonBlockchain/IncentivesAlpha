import React, { useState, useEffect } from "react";
import * as qrImage from "qr-image";
import Modal from "../../common/components/Modal";
import { useModal } from "../../common/providers/Modal.provider";
import styles from "./QRCodeDisplay.module.scss";

export default function RegisterWithQR() {
  const [qr, setQR] = useState({
    image: "",
    data: ""
  });
  const [{ isVisible, data, modal }, toggleModal] = useModal();

  useEffect(() => {
    updateQRCodeImage();
  }, []);

  function updateQRCodeImage() {
    setQR({ image: "" });
    if (data && data.publicAddress) {
      let image = qrImage.imageSync(data.publicAddress, { type: "svg" });
      setQR({ image, data: data.publicAddress });
    }
  }

  return (
    <Modal
      visible={isVisible && modal === "qr"}
      windowClassName={styles.modalWindow}
      onClickClose={() => {
        toggleModal({
          isVisible: false,
          data: null,
          modal: ""
        });
      }}
    >
      <div className={styles.cnt}>
        <div className={styles.header}>
          <h3>Share this QR Code with the Community Health Worker</h3>
          {qr.image ? (
            <div
              className={styles.qrWallet}
              dangerouslySetInnerHTML={{ __html: qr.image.toString() }}
              {...qr.data.publicAddress}
            ></div>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}

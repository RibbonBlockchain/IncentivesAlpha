import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as qrImage from "qr-image";
import Modal from "../../common/components/Modal";
import { HIDE_QR_REGISTRATION_MODAL } from "../../common/constants/qr";
import styles from "./QRCodeDisplay.module.scss";

export default function RegisterWithQR() {
  const [qr, setQR] = useState({
    image: "",
    data: ""
  });
  const { visible, message } = useSelector(state => state.qrRegistration);
  const dispatch = useDispatch();

  useEffect(() => {
    updateQRCodeImage();
  }, [message]);

  function updateQRCodeImage() {
    setQR({ image: "" });
    if (message) {
      let image = qrImage.imageSync(message, { type: "svg" });
      setQR({ image, data: message });
    }
  }

  function closeModal() {
    dispatch({
      type: HIDE_QR_REGISTRATION_MODAL
    });
  }

  return (
    <Modal
      visible={visible}
      windowClassName={styles.modalWindow}
      onClickClose={closeModal}
    >
      <div className={styles.cnt}>
        <div className={styles.header}>
          <h3>Share this QR Code with the Community Health Worker</h3>
          {qr.image ? (
            <div
              className={styles.qrWallet}
              dangerouslySetInnerHTML={{ __html: qr.image.toString() }}
              {...qr.data}
            ></div>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}

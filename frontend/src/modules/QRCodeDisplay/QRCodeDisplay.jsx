import React, { useState, useEffect, useRef } from "react";
import * as qrImage from "qr-image";
import Modal from "../../common/components/Modal";
import { useModal } from "../../common/providers/Modal.provider";
import styles from "./QRCodeDisplay.module.scss";

export default function RegisterWithQR() {
  const [copy, setCopy] = useState("");
  const [qr, setQR] = useState({
    image: "",
    data: ""
  });
  const [{ isVisible, data, modal }, toggleModal] = useModal();
  const copyRef = useRef(null);

  useEffect(() => {
    updateQRCodeImage();
  }, [data]);

  async function copyToClipboard(e) {
    await copyRef.current.select();
    await document.execCommand("copy");
  }

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
          {qr.image ? (
            <>
              {data.message && <h3>{data.message}</h3>}
              <div
                className={styles.qrWallet}
                dangerouslySetInnerHTML={{ __html: qr.image.toString() }}
                {...qr.data.publicAddress}
              ></div>
              <span>{data.publicAddress}</span>
            </>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}

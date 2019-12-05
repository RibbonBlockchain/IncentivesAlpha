/* eslint-disable react-hooks/exhaustive-deps */
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
  }, [data]);

  async function updateQRCodeImage() {
    let address = null;
    setQR({ image: "" });
    if (data && data.details && data.details.publicAddress) {
      if (data.details.type === "onboard") {
        address = `ethereum:${data.details.publicAddress}`;
      } else if (data.details.type === "receive") {
        address = `ethereum:${data.details.publicAddress}`;
      } else if (data.details.type === "offramp") {
        address = `ethereum:${data.details.publicAddress}`;
      }
      let image = await qrImage.imageSync(address, { type: "svg" });
      setQR({ image, data });
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
              {data && data && <h3>{data.message}</h3>}
              <div
                className={styles.qrWallet}
                dangerouslySetInnerHTML={{ __html: qr.image.toString() }}
                {...qr.data.details.publicAddress}
              ></div>
              <span>{qr.data.details.publicAddress}</span>
            </>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}

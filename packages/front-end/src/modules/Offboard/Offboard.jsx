import React, { useState, useEffect } from "react";
import * as qrImage from "qr-image";
import Modal from "../../common/components/Modal";
import { useWeb3 } from "../../common/providers/Web3.provider";
import styles from "./Offboard.module.scss";
import Button from "../../common/components/Button";
import { config } from "../../common/constants/config";

export default function RegisterWithQR() {
  const [qr, setQR] = useState({
    image: "",
    data: ""
  });
  const [{ address }] = useWeb3();
  const [onboardOptions, setOnboardOptions] = useState(false);

  useEffect(() => {
    async function updateQRCodeImage() {
      setQR({ image: "" });
      let formattedAddress = `ethereum:${config.VAULT_CONTRACT_ADDRESS}`;
      let image = await qrImage.imageSync(formattedAddress, { type: "svg" });
      setQR({ image, data: config.VAULT_CONTRACT_ADDRESS });
    }
    updateQRCodeImage();
  }, [address]);

  return (
    <>
      <div className={styles.actions}>
        <Button
          classNames={styles.button_primary}
          onClick={() => setOnboardOptions(true)}
          text="Offboard assets"
        />
      </div>
      <Modal
        visible={onboardOptions}
        windowClassName={styles.modalWindow}
        onClickClose={() => {
          setOnboardOptions(false);
        }}
      >
        <div className={styles.cnt}>
          <div className={styles.header}>
            {qr.image ? (
              <>
                <div
                  className={styles.qrWallet}
                  dangerouslySetInnerHTML={{ __html: qr.image.toString() }}
                  {...qr.data}
                ></div>
              </>
            ) : null}
          </div>
        </div>
      </Modal>
    </>
  );
}

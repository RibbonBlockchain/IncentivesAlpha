import React from "react";
import Modal from "../../common/components/Modal";
import { useModal } from "../../common/providers/Modal.provider";
import styles from "./Network.module.scss";

export default function Network() {
  const [{ isVisible, modal, data }] = useModal();
  return (
    <Modal
      visible={isVisible && modal === "network"}
      windowClassName={styles.modalWindow}
    >
      <div className={styles.cnt}>
        <div className={styles.header}>
          <h3>{data}</h3>
        </div>
      </div>
    </Modal>
  );
}

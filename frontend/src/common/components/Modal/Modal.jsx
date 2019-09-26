import React from "react";
import styles from "./Modal.module.scss";

export default function Modal({
  visible,
  children,
  modalClassName,
  windowClassName,
  contentClassName,
  onClickClose
}) {
  return (
    <div
      className={`${modalClassName} ${styles.wrapper} ${
        visible ? styles.active : ""
      }`}
    >
      <div className={`${styles.window} ${windowClassName}`}>
        <div className={styles.close} onClick={onClickClose}>
          +
        </div>
        <div className={contentClassName}>{visible && children}</div>
      </div>
    </div>
  );
}

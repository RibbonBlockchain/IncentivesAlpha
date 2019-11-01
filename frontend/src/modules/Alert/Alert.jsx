import React from "react";
import { useAlert } from "../../common/providers/Modal.provider";
import styles from "./Alert.module.scss";

function Alert() {
  const [{ isVisible, message }, toggle] = useAlert();

  return (
    <>
      <div
        className={`${styles.cnt} ${isVisible && message ? styles.active : ""}`}
      >
        <div className={styles.data}>
          <div className={styles.status}>{message}</div>
          <div className={styles.name}>
            <div
              className={styles.close}
              onClick={() =>
                toggle({
                  isVisible: false,
                  message: null
                })
              }
            >
              +
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Alert;

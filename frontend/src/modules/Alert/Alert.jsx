import React from "react";
import { useAlert } from "../../common/providers/Modal.provider";
import styles from "./Alert.module.scss";

function Alert() {
  const [{ isVisible, message }, toggle] = useAlert();

  return (
    <>
      {isVisible && message && (
        <div className={[styles.alertWrapper, styles.active].join(" ")}>
          <div className={styles.alert}>
            <div className={styles.msg}>{message}</div>
            <div className={styles.actions}>
              <div
                className={styles.textButton}
                onClick={() =>
                  toggle({
                    isVisible: false,
                    message: null
                  })
                }
              >
                Close
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Alert;

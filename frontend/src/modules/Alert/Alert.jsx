import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { HIDE_ALERT } from "../../common/constants/alert";
import styles from "./Alert.module.scss";

function Alert() {
  const { visible, message } = useSelector(state => state.alert);
  const dispatch = useDispatch();

  return (
    <>
      {visible && (
        <div className={[styles.alertWrapper, styles.active].join(" ")}>
          <div className={styles.alert}>
            <div className={styles.msg}>{message}</div>
            <div className={styles.actions}>
              <div
                className={styles.textButton}
                onClick={() =>
                  dispatch({
                    type: HIDE_ALERT
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

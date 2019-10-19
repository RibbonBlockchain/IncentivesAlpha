import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import useForm from "react-hook-form";
import Button from "../../common/components/Button";
import Modal from "../../common/components/Modal";
import * as moment from "moment";
import styles from "./Recorder.module.scss";
import { SHOW_ALERT } from "../../common/constants/alert";
import { getItem, clear } from "../../common/utils/storage";
import { roleNames, roles } from "../../common/constants/roles";

export default function Recorder() {
  const [visible, setVisible] = useState(false);
  let loginType = getItem("loginType");

  return (
    <>
      {loginType < roleNames.PRACTITIONER && (
        <div className={styles.actions}>
          <Button
            classNames={styles.button_primary}
            onClick={() => setVisible(true)}
            text="Record Activity"
          />
        </div>
      )}
      <RecorderModal
        visible={visible}
        type={loginType}
        onDismiss={() => setVisible(false)}
      />
    </>
  );
}

function RecorderModal({ visible, onDismiss, type }) {
  const { handleSubmit, register, errors, formState } = useForm({
    mode: "onChange"
  });
  let dispatch = useDispatch();
  async function onSubmit(values, e) {
    let data = {
      ...values,
      //   dateOfBirth: moment(date).format("YYYY/M/D"),
      role: type
      //   phoneNumber: phoneNumber.value
    };
    // let newUser = await createNewUser(data);
  }
  return (
    <>
      <Modal
        visible={visible}
        onClickClose={onDismiss}
        windowClassName={styles.modalFormWindow}
        closeClassName={styles.close}
      >
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className={[styles.container, styles.form].join(" ")}>
            <h2 className={styles.form_heading}>Record Patient Interaction</h2>
            <div className={styles.form_body}>
              <div className={[styles.layout].join(" ")}>
                <div className={styles.layout__item}>
                  <div className={[styles.input].join(" ")}>
                    <label htmlFor="firstName">First Name</label>
                    <input
                      className={[styles.form_input].join(" ")}
                      placeholder="first name"
                      name="firstName"
                      type="text"
                      ref={register({
                        required: "First name is required",
                        pattern: {
                          value: /^[a-zA-Z ]+$/i,
                          message: "invalid first name"
                        }
                      })}
                    />
                    <small>
                      {" "}
                      {errors.firstName && errors.firstName.message}
                    </small>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.actions}>
              <Button
                type="button"
                text={"Cancel"}
                onClick={onDismiss}
                classNames={[styles.button].join(" ")}
              ></Button>
              <Button
                text="Save"
                classNames={[styles.button, styles.button_primary].join(" ")}
                button="submit"
              ></Button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}

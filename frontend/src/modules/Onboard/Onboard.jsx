import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { createNewUser } from "./onboard.utils";
import { roleNames, roles } from "../../common/constants/roles";
import TextInput from "../../common/components/TextInput";
import Button from "../../common/components/Button";
import Modal from "../../common/components/Modal";
import styles from "./Onboard.module.scss";
import { SHOW_ALERT } from "../../common/constants/alert";
import { getItem, clear } from "../../common/utils/storage";

export default function Onboard() {
  const [onboardOptions, setOnboardOptions] = useState(false);
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState(null);

  let dispatch = useDispatch();

  let firstNameRef = useRef(null);
  let lastNameRef = useRef(null);
  let dateOfBirthRef = useRef(null);
  let idNumberRef = useRef(null);
  let publicAddressRef = useRef(null);

  let loginType = getItem("loginType");

  function showOption() {
    setOnboardOptions(true);
  }

  function showPatientForm() {
    setOnboardOptions(false);
    setVisible(true);
    setType(roleNames.PATIENT);
  }

  function showPractitionerForm() {
    setOnboardOptions(false);
    setVisible(true);
    setType(roleNames.PRACTITIONER);
  }

  function showCHWForm() {
    setOnboardOptions(false);
    setVisible(true);
    setType(roleNames.HEALTH_WORKER);
  }

  function hideForm() {
    setVisible(false);
  }

  async function createUser() {
    let data = {
      firstName: firstNameRef.current.value,
      lastName: lastNameRef.current.value,
      dateOfBirth: dateOfBirthRef.current.value,
      idNumber: idNumberRef.current.value,
      publicAddress: publicAddressRef.current.value,
      role: type
    };

    let newUser = await createNewUser(data);
    if (newUser.error) {
        dispatch({
          type: SHOW_ALERT,
          payload: newUser.error
        });
    } else {
      dispatch({
        type: SHOW_ALERT,
        payload: `${formatRoleName(type)} has been registered successfully`
      });
      clearForm();
    }
  }

  function clearForm() {
    firstNameRef.current.value = "";
    lastNameRef.current.value = "";
    dateOfBirthRef.current.value = "";
    idNumberRef.current.value = "";
    publicAddressRef.current.value = "";
  }

  async function createUserAndExit() {
    await createUser();
    hideForm();
  }

  function formatRoleName(type) {
    return typeof roles[type] != "undefined" && roles[type].replace("_", " ");
  }

  const OnboardOptions = ({ visible }) => {
    return (
      <Modal visible={visible} windowClassName={styles.modalWindow}>
        <div className={styles.cnt}>
          <h4>Pick a profile</h4>
          {loginType == Number(roleNames.SUPER_ADMIN) && (
            <Button
              onClick={showPractitionerForm}
              text="Practitioner Profile"
            />
          )}
          {loginType == Number(roleNames.HEALTH_WORKER) && (
            <Button
              onClick={showPractitionerForm}
              text="Practitioner Profile"
            />
          )}
          <Button onClick={showPatientForm} text="Patient Profile" />
          <Button onClick={showCHWForm} text="Health Worker Profile" />
        </div>
      </Modal>
    );
  };

  const OnboardForm = ({ visible, onClickClose }) => {
    return (
      <Modal
        visible={visible}
        onClickClose={onClickClose}
        windowClassName={styles.modalFormWindow}
        closeClassName={styles.close}
      >
        <div className={styles.container}>
          <h2 className={styles.form_heading}>
            Register new {formatRoleName(type)}
          </h2>
          <div className={[styles.layout].join(" ")}>
            <div className={styles.layout__item}>
              <TextInput
                placeholder="firstname"
                classNames={styles.input_area}
                inputType="text"
                refs={firstNameRef}
                label="First name"
              />
            </div>
            <div className={styles.layout__item}>
              <TextInput
                placeholder="lastname"
                classNames={styles.input_area}
                inputType="text"
                refs={lastNameRef}
                label="Last name"
              />
            </div>
          </div>
          <div className={[styles.layout].join(" ")}>
            <div className={styles.layout__full}>
              <TextInput
                placeholder="date of birth"
                classNames={styles.input_area}
                inputType="text"
                refs={dateOfBirthRef}
                label="Date of Birth"
              />
            </div>
            <div className={styles.layout__full}>
              <TextInput
                placeholder="id number"
                classNames={styles.input_area}
                inputType="text"
                refs={idNumberRef}
                label="ID Number"
              />
            </div>
            <div className={styles.layout__item}>
              <TextInput
                placeholder="0x0..."
                classNames={styles.input_area}
                inputType="text"
                refs={publicAddressRef}
                label="Public Address"
              />
            </div>
          </div>
          <div className={styles.actions}>
            <Button
              text={"Exit"}
              classNames={[styles.button].join(" ")}
              onClick={onClickClose}
            ></Button>
            <Button
              text="Save"
              classNames={[styles.button, styles.button_primary].join(" ")}
              onClick={createUser}
            ></Button>
            <Button
              text={"Save and Exit"}
              classNames={[styles.button, styles.button_primary].join(" ")}
              onClick={createUserAndExit}
            ></Button>
          </div>
        </div>
      </Modal>
    );
  };
  return (
    <>
      <div className={styles.actions}>
        <Button onClick={() => showOption()} text="New Account" />
      </div>
      <OnboardOptions visible={onboardOptions} />
      <OnboardForm visible={visible} onClickClose={hideForm} />
    </>
  );
}

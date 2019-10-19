import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import useForm from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import * as moment from "moment";
import "react-phone-number-input/style.css";
import { createNewUser } from "./onboard.utils";
import { roleNames, roles } from "../../common/constants/roles";
import Button from "../../common/components/Button";
import Modal from "../../common/components/Modal";
import styles from "./Onboard.module.scss";
import { SHOW_ALERT } from "../../common/constants/alert";
import { getItem, clear } from "../../common/utils/storage";

export default function Onboard() {
  const [onboardOptions, setOnboardOptions] = useState(false);
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState(null);
  const { handleSubmit, register, errors, formState } = useForm({
    mode: "onChange"
  });

  const [date, setDate] = useState(new Date());
  const [phoneNumber, setPhoneNumber] = useState({
    value: null,
    isValid: false
  });

  let dispatch = useDispatch();

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

  async function onSubmit(values, e) {
    let data = {
      ...values,
      dateOfBirth: moment(date).format("YYYY/M/D"),
      role: type,
      phoneNumber: phoneNumber.value
    };
    let newUser = await createNewUser(data);
    if (newUser.error) {
      if (newUser.error === 11000) {
        dispatch({
          type: SHOW_ALERT,
          payload: `Wallet Address ${values.publicAddress} already has an associated account`
        });
      } else {
        dispatch({
          type: SHOW_ALERT,
          payload: "An error occured. Please try again"
        });
      }
    } else {
      dispatch({
        type: SHOW_ALERT,
        payload: `${formatRoleName(type)} has been registered successfully`
      });
      clearForm(e);
    }
  }

  function clearForm(e) {
    e.target.reset();
    setPhoneNumber({
      isValid: false,
      value: null
    });
  }

  function formatRoleName(type) {
    return typeof roles[type] != "undefined" && roles[type].replace("_", " ");
  }

  function checkValidation() {
    return formState.isValid && phoneNumber.isValid ? false : true;
  }

  const OnboardOptions = ({ visible }) => {
    return (
      <Modal visible={visible} windowClassName={styles.modalWindow}>
        <div className={styles.cnt}>
          <h4>Pick a profile</h4>
          {loginType == Number(roleNames.SUPER_ADMIN) && (
            <>
              <Button onClick={showCHWForm} text="Health Worker Profile" />
              <Button
                onClick={showPractitionerForm}
                text="Practitioner Profile"
              />
              <Button onClick={showPatientForm} text="Patient Profile" />
            </>
          )}
          {loginType == Number(roleNames.HEALTH_WORKER) && (
            <>
              <Button
                onClick={showPractitionerForm}
                text="Practitioner Profile"
              />
              <Button onClick={showPatientForm} text="Patient Profile" />
            </>
          )}
        </div>
      </Modal>
    );
  };

  return (
    <>
      {loginType < roleNames.PRACTITIONER && (
        <div className={styles.actions}>
          <Button onClick={() => showOption()} text="New Account" />
        </div>
      )}
      <Modal
        visible={visible}
        onClickClose={hideForm}
        windowClassName={styles.modalFormWindow}
        closeClassName={styles.close}
      >
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className={[styles.container, styles.form].join(" ")}>
            <h2 className={styles.form_heading}>
              Register new{" "}
              {formatRoleName(type)
                .toString()
                .toLowerCase()}
            </h2>
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
                <div className={styles.layout__item}>
                  <div className={[styles.input].join(" ")}>
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      className={[styles.form_input].join(" ")}
                      placeholder="last name"
                      ref={register({
                        required: "Last name is required",
                        pattern: {
                          value: /^[a-zA-Z ]+$/i,
                          message: "invalid last name"
                        }
                      })}
                      name="lastName"
                      type="text"
                    />
                    <small> {errors.lastName && errors.lastName.message}</small>
                  </div>
                </div>
              </div>
              <div className={[styles.layout].join(" ")}>
                <div className={styles.layout__full}>
                  <div className={styles.input}>
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <DatePicker
                      dateFormat="yyyy/MM/dd"
                      selected={date}
                      name="dateOfBirth"
                      className={styles.datepicker}
                      placeholderText="date of birth"
                      onChange={date => setDate(date)}
                    />
                    <small>
                      {errors.dateOfBirth && errors.dateOfBirth.message}
                    </small>
                  </div>
                </div>
                <div className={styles.layout__full}>
                  <div className={[styles.input].join(" ")}>
                    <label htmlFor="idNumber">
                      {formatRoleName(type)
                        .toString()
                        .toLowerCase()}
                      {" ID Number"}
                    </label>
                    <input
                      className={[styles.form_input].join(" ")}
                      placeholder={`${formatRoleName(type)
                        .toString()
                        .toLowerCase()} ID Number`}
                      ref={register({
                        required: `${formatRoleName(type)
                          .toString()
                          .toLowerCase()} ID Number is required`,
                        pattern: {}
                      })}
                      name="idNumber"
                      type="text"
                    />
                    <small>{errors.idNumber && errors.idNumber.message}</small>
                  </div>
                </div>
                <div className={styles.layout__item}>
                  <div className={[styles.input].join(" ")}>
                    <label htmlFor="publicAddress">Wallet Address</label>
                    <input
                      className={[styles.form_input].join(" ")}
                      placeholder="0x0..."
                      ref={register({
                        required: "Wallet Address is required",
                        pattern: {
                          value: /^0x[a-fA-F0-9]{40}$/i,
                          message: "invalid wallet address"
                        }
                      })}
                      name="publicAddress"
                      type="text"
                    />
                    <small>
                      {errors.publicAddress && errors.publicAddress.message}
                    </small>
                  </div>
                </div>
              </div>
              <div className={styles.layout}>
                <div className={styles.layout__item}>
                  <div className={[styles.input].join(" ")}>
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <PhoneInput
                      className={[styles.form_input].join(" ")}
                      placeholder="phone number"
                      onChange={value => {
                        setPhoneNumber({
                          isValid: isValidPhoneNumber(value),
                          value
                        });
                      }}
                    />
                    {phoneNumber.value && !phoneNumber.isValid && (
                      <small>invalid phone number</small>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.actions}>
              <Button
                type="button"
                text={"Exit"}
                classNames={[styles.button].join(" ")}
                onClick={hideForm}
              ></Button>
              <Button
                text="Save"
                classNames={[styles.button, styles.button_primary].join(" ")}
                disabled={checkValidation()}
                button="submit"
              ></Button>
            </div>
          </div>
        </form>
      </Modal>
      <OnboardOptions visible={onboardOptions} />
    </>
  );
}

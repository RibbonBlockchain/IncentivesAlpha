import React, { useState } from "react";
import useForm from "react-hook-form";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { ethers } from "ethers";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import QRScanner from "qr-code-scanner";
import * as moment from "moment";
import "react-phone-number-input/style.css";
import { createNewUser, recordNewUser } from "./onboard.utils";
import { roleNames, roles } from "../../common/constants/roles";
import Button from "../../common/components/Button";
import Modal from "../../common/components/Modal";
import styles from "./Onboard.module.scss";
import { useWeb3 } from "../../common/providers/Web3.provider";
import { useAlert } from "../../common/providers/Modal.provider";
import { useTransactionStatus } from "../../common/providers/TransactionStatus.provider";
import { useData } from "../../common/providers/API.provider";

const titles = [
  { value: "MR", label: "MR" },
  { value: "MRS", label: "MRS" },
  { value: "MISS", label: "MISS" },
  { value: "MS", label: "MS" },
  { value: "PROF", label: "PROF" },
  { value: "DR", label: "DR" },
  { value: "NURSE", label: "NURSE" },
  { value: "ENGR", label: "ENGR" }
];
const SelectStyle = {
  control: (base, state) => ({
    ...base
  }),
  menu: base => ({
    ...base,
    borderRadius: 0,
    background: "#313541",
    cursor: "pointer",
    marginTop: 0
  }),
  menuList: base => ({
    ...base,
    borderRadius: 0,
    cursor: "pointer",
    padding: 0
  })
};
export default function Onboard() {
  const [onboardOptions, setOnboardOptions] = useState(false);
  const [record, setRecord] = useState({});
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState(null);
  const [, fetchData] = useData();
  const [{ loginType }] = useWeb3();
  const [loading, setLoading] = useState(false);
  const [
    ,
    checkTransactionStatus,
    closeTransactionStatus
  ] = useTransactionStatus();
  const [{}, toggle] = useAlert();
  const {
    handleSubmit,
    register,
    errors,
    formState,
    setValue,
    triggerValidation
  } = useForm({
    mode: "onChange"
  });

  const [date, setDate] = useState(new Date());
  const [phoneNumber, setPhoneNumber] = useState({
    value: null,
    isValid: false
  });

  function showAdminForm() {
    setOnboardOptions(false);
    setVisible(true);
    setType(roleNames.SUPER_ADMIN);
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
      title: record.title.value,
      phoneNumber: phoneNumber.value
    };
    setLoading(true);
    let newUser = await createNewUser(data);
    if (newUser.error) {
      setLoading(false);
      toggle({
        isVisible: true,
        message: newUser.error,
        data: {}
      });
    } else {
      await checkTransactionStatus(newUser);
      let record = await recordNewUser(data);
      closeTransactionStatus();
      if (record.error) {
        setLoading(false);
        toggle({
          isVisible: true,
          message: record.error,
          data: {}
        });
      } else {
        await fetchData();
        clearForm(e);
        setVisible(false);
        setLoading(false);
        toggle({
          isVisible: true,
          message: `${formatRoleName(type)} has been registered successfully`,
          data: {}
        });
      }
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

  function captureAddressFromQRCodeDisplay() {
    QRScanner.initiate({
      onResult: address => {
        if (ethers.utils.getAddress(address)) {
          setValue("publicAddress", address);
          triggerValidation({ name: "publicAddress", value: address });
        } else {
          toggle({
            isVisible: true,
            message: `Address ${address} does not match checksum`,
            data: {}
          });
        }
      },
      timeout: 20000
    });
  }

  const OnboardOptions = ({ visible, onClickClose }) => {
    return (
      <Modal
        visible={visible}
        onClickClose={onClickClose}
        windowClassName={styles.modalWindow}
      >
        <div className={styles.cnt}>
          <h4>Create a User</h4>
          {loginType == Number(roleNames.SUPER_ADMIN) && (
            <>
              <Button
                classNames={styles.button}
                onClick={showAdminForm}
                text="Administrator"
              />
              <Button
                classNames={styles.button}
                onClick={showCHWForm}
                text="Community Health Worker"
              />
              <Button
                classNames={styles.button}
                onClick={showPractitionerForm}
                text="Practitioner"
              />
              <Button
                classNames={styles.button}
                onClick={showPatientForm}
                text="Patient"
              />
            </>
          )}
          {loginType == Number(roleNames.HEALTH_WORKER) && (
            <>
              <Button
                onClick={showPractitionerForm}
                text="Practitioner Profile"
                classNames={styles.button}
              />
              <Button
                classNames={styles.button}
                onClick={showPatientForm}
                text="Patient Profile"
              />
            </>
          )}
        </div>
      </Modal>
    );
  };

  return (
    <>
      <div className={styles.actions}>
        <Button onClick={() => setOnboardOptions(true)} text="New Account" />
      </div>
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
            <div className={styles.actions}>
              <Button
                text="Capture Wallet Address"
                classNames={[styles.button, styles.button_primary].join(" ")}
                onClick={captureAddressFromQRCodeDisplay}
                button="button"
              ></Button>
            </div>
            <div className={styles.form_body}>
              <div className={[styles.layout].join(" ")}>
                <div className={styles.layout__item}>
                  <label htmlFor="title">Title</label>
                  <Select
                    isSearchable
                    value={record.title}
                    placeholder="Title"
                    theme={theme => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        neutral30: "#313541",
                        primary: "black"
                      }
                    })}
                    onChange={title => {
                      setRecord({
                        title
                      });
                    }}
                    options={titles}
                    styles={SelectStyle}
                  />
                </div>
                <div className={styles.layout__item}></div>
                <div className={styles.layout__item}></div>
                <div className={styles.layout__item}></div>
              </div>
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
                disabled={checkValidation() || loading}
                button="submit"
              ></Button>
            </div>
          </div>
        </form>
      </Modal>
      <OnboardOptions
        visible={onboardOptions}
        onClickClose={() => setOnboardOptions(false)}
      />
    </>
  );
}

import React, { useState } from "react";
import useForm from "react-hook-form";
import QrReader from "react-qr-reader";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import DatePicker from "react-datepicker";
import Select from "react-select";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import * as moment from "moment";
import "react-phone-number-input/style.css";
import { createNewUser, recordNewUser } from "./onboard.utils";
import { roleNames, roles } from "../../common/constants/roles";
import Button from "../../common/components/Button";
import Modal from "../../common/components/Modal";
import { getByRole } from "../Dashboard/dashboard.utils";
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

const gender = [
  { value: "Male", label: "MALE" },
  { value: "Female", label: "FEMALE" }
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

const formatUserOptionLabel = ({ label, value }) => {
  return (
    <>
      {value && (
        <>
          <div className={styles.optionLabel}>
            <div className={styles.optionLabel_user__heading}>
              <span>{`${value.firstName} ${value.lastName}`}</span>
              <span>{label}</span>
            </div>
            <small>{value.publicAddress}</small>
          </div>
        </>
      )}
    </>
  );
};
export default function Onboard() {
  const [onboardOptions, setOnboardOptions] = useState(false);
  const [record, setRecord] = useState({
    title: "",
    relatedTo: "",
    gender: "Male",
    location: {}
  });
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState(null);
  const [{ users }, fetchData] = useData();
  const [{ user, loginType, token }] = useWeb3();
  const [loading, setLoading] = useState(false);
  const [openQR, setOpenQR] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [
    ,
    checkTransactionStatus,
    closeTransactionStatus
  ] = useTransactionStatus();
  const [, toggle] = useAlert();
  const { handleSubmit, register, errors, formState } = useForm({
    mode: "onChange"
  });

  const [date, setDate] = useState(new Date());
  const [isChecked, setIsChecked] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState({
    value: null,
    isValid: false
  });

  let patients = getByRole(users, roleNames.PATIENT);

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
    setPhoneNumber({
      isValid: false,
      value: null
    });
    setIsChecked(false);
  }

  async function onSubmit(values, e) {
    let data = {
      ...values,
      dateOfBirth: moment(date).format("YYYY/M/D"),
      role: type,
      title: record.title.value,
      phoneNumber: phoneNumber.value,
      gender: record.title.value,
      location: record.location,
      publicAddress: walletAddress
    };
    if (isChecked) {
      data.parent_id = record.relatedTo.value._id;
      data.onBoardedBy = user._id;
      data.publicAddress = record.relatedTo.value.publicAddress;
      data.category = 0;
    }

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
      if (isChecked) {
        delete data.publicAddress;
        delete data.phoneNumber;
        delete data.title;
      }
      let record = await recordNewUser(data, token);
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
          message: `${
            record.relatedTo ? "Minor" : formatRoleName(type)
          } has been registered successfully`,
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
    setIsChecked(false);
    setWalletAddress("");
  }

  function formatRoleName(type) {
    return typeof roles[type] != "undefined" && roles[type].replace("_", " ");
  }

  function checkValidation() {
    return formState.isValid && phoneNumber.isValid ? false : true;
  }

  function handleScan(data) {
    console.log("Data ", data);
    if (data !== null) {
      let walletAddress = data.split(":")[1];
      console.log(walletAddress);
      setWalletAddress(walletAddress);
      setOpenQR(false);
    }
  }

  function handleError(error) {
    console.log("Errr");
  }

  function handleIsMinor() {
    setIsChecked(!isChecked);
    register({ name: "publicAddress" }, { required: false });
    setPhoneNumber({ value: "", isValid: true });
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
          {loginType === Number(roleNames.SUPER_ADMIN) && (
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
          {loginType === Number(roleNames.HEALTH_WORKER) && (
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
        {!openQR && (
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
                  onClick={() => setOpenQR(true)}
                  disabled={isChecked}
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
                          title,
                          location: record.location,
                          gender: record.gender,
                          relatedTo: record.relatedTo
                        });
                      }}
                      options={titles}
                      styles={SelectStyle}
                    />
                  </div>

                  {type === Number(roleNames.PATIENT) && (
                    <div className={styles.layout__item}>
                      <div
                        className={[styles.input, styles.checkbox].join(" ")}
                      >
                        <label htmlFor="minor">
                          <input
                            type="checkbox"
                            value={isChecked}
                            onChange={handleIsMinor}
                          />
                          &nbsp; Is Patient a minor?
                        </label>
                      </div>
                    </div>
                  )}
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
                      <small>
                        {" "}
                        {errors.lastName && errors.lastName.message}
                      </small>
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
                      <small>
                        {errors.idNumber && errors.idNumber.message}
                      </small>
                    </div>
                  </div>
                  {!isChecked ? (
                    <div className={styles.layout__item}>
                      <div className={[styles.input].join(" ")}>
                        <label htmlFor="publicAddress">Wallet Address</label>
                        <input
                          className={[styles.form_input].join(" ")}
                          placeholder="0x0..."
                          value={walletAddress}
                          name="publicAddress"
                          type="text"
                          onChange={e => setWalletAddress(e.target.value)}
                        />
                        <small>
                          {errors.publicAddress && errors.publicAddress.message}
                        </small>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.layout__item}>
                      <div className={[styles.input].join(" ")}>
                        <label htmlFor="guardianIDNumber">
                          Select Guardian
                        </label>
                        <Select
                          isSearchable
                          value={record.relatedTo}
                          placeholder="Select Guardian"
                          theme={theme => ({
                            ...theme,
                            borderRadius: 0,
                            colors: {
                              ...theme.colors,
                              neutral30: "#313541",
                              primary: "black"
                            }
                          })}
                          formatOptionLabel={formatUserOptionLabel}
                          onChange={relatedTo =>
                            setRecord({
                              title: record.title,
                              location: record.location,
                              gender: record.gender,
                              relatedTo
                            })
                          }
                          options={patients}
                          styles={SelectStyle}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className={styles.layout}>
                  <div className={styles.layout__item}>
                    <div className={[styles.input].join(" ")}>
                      <label htmlFor="gender">Gender</label>
                      <Select
                        isSearchable
                        value={record.gender}
                        placeholder="Gender"
                        theme={theme => ({
                          ...theme,
                          borderRadius: 0,
                          colors: {
                            ...theme.colors,
                            neutral30: "#313541",
                            primary: "black"
                          }
                        })}
                        onChange={gender => {
                          setRecord({
                            title: record.title,
                            gender,
                            location: record.location,
                            relatedTo: record.relatedTo
                          });
                        }}
                        options={gender}
                        styles={SelectStyle}
                      />
                    </div>
                  </div>
                  {!isChecked && (
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
                  )}
                </div>
                <div className={styles.layout__item}>
                  <div className={[styles.input].join(" ")}>
                    <label htmlFor="location">House Address</label>
                    <GooglePlacesAutocomplete
                      onSelect={location => {
                        setRecord({
                          location: location.description
                            ? location.description
                            : location,
                          title: record.title,
                          gender: record.gender,
                          relatedTo: record.relatedTo
                        });
                      }}
                    />
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
        )}
        {openQR && (
          <QrReader
            delay={1000}
            onError={handleError}
            onScan={handleScan}
            style={{ width: "100%" }}
            resolution={1200}
          />
        )}
      </Modal>
      <OnboardOptions
        visible={onboardOptions}
        onClickClose={() => setOnboardOptions(false)}
      />
    </>
  );
}

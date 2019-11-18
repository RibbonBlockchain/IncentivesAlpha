/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import useForm from "react-hook-form";
import Select from "react-select";
import StarRatingComponent from "react-star-rating-component";
import makeAnimated from "react-select/animated";
import Button from "../../common/components/Button";
import Modal from "../../common/components/Modal";
import styles from "./Recorder.module.scss";
import {
  getByRole,
  formatActivityOptions,
  formatPrescriptionOptions
} from "../Dashboard/dashboard.utils";
import { roleNames } from "../../common/constants/roles";
import { recordInteraction, recordInteractionOnDB } from "./recorder.utils";
import { useWeb3 } from "../../common/providers/Web3.provider";
import { useApp } from "../../common/providers/App.provider";
import { useAlert } from "../../common/providers/Modal.provider";
import { useData } from "../../common/providers/API.provider";
import { useTransactionStatus } from "../../common/providers/TransactionStatus.provider";

const animatedComponents = makeAnimated();

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

const formatActivityOptionLabel = ({ label, value }) => {
  return (
    <>
      {value && (
        <>
          <div className={styles.optionLabel}>
            <div className={styles.optionLabel__heading}>
              <span>{`${label}`}</span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

const formatPrescriptionOptionLabel = ({ label, value }) => {
  return (
    <>
      {value && (
        <>
          <div className={styles.optionLabel}>
            <div className={styles.optionLabel__heading}>
              <span>{`${label}`}</span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default function Recorder() {
  const [visible, setVisible] = useState(false);
  const [{ loginType, user }] = useWeb3();
  const [{ users }] = useData();

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
        users={users}
        user={user}
        onDismiss={() => setVisible(false)}
      />
    </>
  );
}

function RecorderModal({ visible, onDismiss, type, users, user }) {
  const { handleSubmit, register } = useForm({
    mode: "onChange"
  });
  const [loading, setLoading] = useState(false);
  const [
    { activityList, prescriptionList, ratingList },
    loadDetails
  ] = useApp();

  const [
    ,
    checkTransactionStatus,
    closeTransactionStatus
  ] = useTransactionStatus();
  const [, toggle] = useAlert();
  const [record, setRecord] = useState({
    patient: {},
    practitioner: {},
    prescriptions: [],
    activities: [],
    notes: ""
  });
  const [ratings, setRatings] = useState({});
  const [, fetchData] = useData();

  useEffect(() => {
    loadDetails();
  }, []);

  let patients = getByRole(users, roleNames.PATIENT);
  let practitioners = getByRole(users, roleNames.PRACTITIONER);
  let activities = formatActivityOptions(activityList);
  let prescriptions = formatPrescriptionOptions(prescriptionList);

  function isValid() {
    let { patient, practitioner, activities, prescriptions } = record;
    let state =
      patient.hasOwnProperty("_id") &&
      practitioner.hasOwnProperty("_id") &&
      activities.length > 0 &&
      prescriptions.length > 0;
    return state ? true : false;
  }

  async function onSubmit(values) {
    let data = {
      ...values,
      patient: record.patient,
      practitioner: record.practitioner,
      user,
      activities: record.activities,
      prescriptions: record.prescriptions,
      serviceRatings: ratings,
      amount: record.activities
        .map(activity => activity.data.activityReward)
        .reduce((activity, acc) => activity + acc, 0)
    };
    setLoading(true);
    let interaction = await recordInteraction(data);
    if (interaction.error) {
      setLoading(false);
      toggle({
        isVisible: true,
        message: interaction.error
      });
    } else {
      await checkTransactionStatus(interaction);
      let record = await recordInteractionOnDB(data);
      closeTransactionStatus();
      if (record.error) {
        setLoading(false);
        toggle({
          isVisible: true,
          message: record.error,
          data: {}
        });
      } else {
        fetchData();
        clearDismiss();
        setLoading(false);
        toggle({
          isVisible: true,
          message: `Interaction has been recorded successfully`
        });
      }
    }
  }

  function handleRating(index, e) {
    let currentRating = ratings;
    if (typeof currentRating[index] === "undefined") {
      setRatings({
        ...currentRating,
        [index]: e
      });
    } else {
      delete currentRating[index];
      setRatings({
        ...currentRating,
        [index]: e
      });
    }
  }

  function clearDismiss() {
    setRecord({
      patient: {},
      practitioner: {},
      activities: [],
      prescriptions: [],
      ratings: [],
      notes: ""
    });
    setRatings({});
    onDismiss();
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
            <h2 className={styles.form_heading}>Record Interaction</h2>
            <div className={styles.col}>
              <div className="">
                <div className={styles.form_body}>
                  <div className={[styles.layout].join(" ")}>
                    <div className={styles.layout__item}>
                      <div className={[styles.input].join(" ")}>
                        <label htmlFor="patientIDNumber">
                          Patient ID Number
                        </label>
                        <Select
                          isSearchable
                          value={record.patient}
                          placeholder="Patient ID Number"
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
                          onChange={patient =>
                            setRecord({
                              practitioner: record.practitioner,
                              patient,
                              prescriptions: record.prescriptions,
                              activities: record.activities
                            })
                          }
                          options={patients}
                          styles={SelectStyle}
                        />
                      </div>
                    </div>
                    <div className={styles.layout__item}>
                      <div className={[styles.input].join(" ")}>
                        <label htmlFor="practitionerIDNumber">
                          Practitioner ID Number
                        </label>
                        <Select
                          isSearchable
                          value={record.practitioner}
                          placeholder="Practitioner ID Number"
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
                          onChange={practitioner => {
                            setRecord({
                              practitioner,
                              patient: record.patient,
                              prescriptions: record.prescriptions,
                              activities: record.activities
                            });
                          }}
                          options={practitioners}
                          styles={SelectStyle}
                        />
                      </div>
                    </div>
                  </div>
                  {activities.length > 0 && (
                    <div className={styles.layout__item}>
                      <label htmlFor="activity">Activity</label>
                      <Select
                        isSearchable
                        value={record.activities}
                        placeholder="Select Activity"
                        formatOptionLabel={formatActivityOptionLabel}
                        name={`activities`}
                        components={animatedComponents}
                        isMulti
                        theme={theme => ({
                          ...theme,
                          borderRadius: 0,
                          colors: {
                            ...theme.colors,
                            neutral30: "#313541",
                            primary: "black"
                          }
                        })}
                        onChange={activities =>
                          setRecord({
                            practitioner: record.practitioner,
                            patient: record.patient,
                            prescriptions: record.prescriptions,
                            activities
                          })
                        }
                        options={activities}
                        styles={SelectStyle}
                      />
                    </div>
                  )}
                  <div className={styles.layout}>
                    {prescriptions.length > 0 && (
                      <div className={styles.layout__item}>
                        <div className={[styles.input].join(" ")}>
                          <label htmlFor="prescriptions">Prescriptions</label>
                          <Select
                            isSearchable
                            value={record.prescriptions}
                            placeholder="Select prescriptions"
                            name={`prescriptions`}
                            isMulti
                            formatOptionLabel={formatPrescriptionOptionLabel}
                            components={animatedComponents}
                            theme={theme => ({
                              ...theme,
                              borderRadius: 0,
                              colors: {
                                ...theme.colors,
                                neutral30: "#313541",
                                primary: "black"
                              }
                            })}
                            onChange={prescriptions =>
                              setRecord({
                                practitioner: record.practitioner,
                                patient: record.patient,
                                prescriptions,
                                activities: record.activities
                              })
                            }
                            options={prescriptions}
                            styles={SelectStyle}
                          />
                        </div>
                      </div>
                    )}
                    <div className={styles.layout__item}>
                      <div className={[styles.input].join(" ")}>
                        <label htmlFor="prescriptionNo">
                          Prescription Number
                        </label>
                        <input
                          className={[styles.form_input].join(" ")}
                          placeholder="Prescription Number"
                          name="prescriptionNo"
                          type="text"
                          ref={register({
                            required: "Prescription Number is required",
                            pattern: {}
                          })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.layout__item}>
                    <div className={[styles.input].join(" ")}>
                      <label htmlFor="notes">Additional notes</label>
                      <textarea
                        name="notes"
                        cols="30"
                        rows="10"
                        placeholder="Notes (optional)"
                        ref={register}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className="">
                {ratingList &&
                  ratingList[0].ratingTypes &&
                  ratingList[0].ratingTypes.length > 0 && (
                    <div className={styles.layout__item}>
                      <fieldset>
                        <legend>Rate the services</legend>
                        {ratingList &&
                          ratingList[0] &&
                          ratingList[0].ratingTypes.length > 0 &&
                          ratingList[0].ratingTypes.map((rating, index) => (
                            <div className={styles.rating} key={index}>
                              <StarRatingComponent
                                starCount={5}
                                name={index}
                                starColor="#ffb400"
                                emptyStarColor="#ffb400"
                                value={ratings[index] ? ratings[index] : 0}
                                onStarClick={e => handleRating(index, e)}
                                renderStarIcon={(index, value) => {
                                  return (
                                    <span>
                                      <i
                                        className={
                                          index <= value
                                            ? "fas fa-star"
                                            : "far fa-star"
                                        }
                                      />
                                    </span>
                                  );
                                }}
                              />
                              <label htmlFor={index}>{rating.title}</label>
                            </div>
                          ))}
                      </fieldset>
                    </div>
                  )}
              </div>
            </div>
            <div className={styles.actions}>
              <Button
                type="button"
                text={"Cancel"}
                onClick={clearDismiss}
                classNames={[styles.button].join(" ")}
              ></Button>
              <Button
                text="Save"
                disabled={loading}
                classNames={[styles.button, styles.button_primary].join(" ")}
                button="button"
              ></Button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}

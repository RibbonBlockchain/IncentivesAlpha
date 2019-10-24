import React, { useState } from "react";
import useForm from "react-hook-form";
import Select, { components } from "react-select";
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
import { recordInteraction } from "./recorder.utils";
import Rating from "../../common/components/Rating";
import { useWeb3 } from "../../common/providers/Web3.provider";
import { useApp } from "../../common/providers/App.provider";
import { useAlert } from "../../common/providers/Modal.provider";
import { useData } from "../../common/providers/API.provider";

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

const formatOptionLabel = ({ label, value }) => {
  return (
    <>
      {value && (
        <>
          <div className={styles.optionLabel}>
            <div className={styles.optionLabel__heading}>
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
  const [{ activityList, prescriptionList }] = useApp();
  const [{}, toggle] = useAlert();
  const [record, setRecord] = useState({
    patient: {},
    practitioner: {},
    prescriptions: [],
    activities: [],
    ratings: [],
    notes: ""
  });
  let patients = getByRole(users, roleNames.PATIENT);
  let practitioners = getByRole(users, roleNames.PRACTITIONER);
  let activities = formatActivityOptions(activityList);
  let prescriptions = formatPrescriptionOptions(prescriptionList);
  let ratingList = [];

  async function onSubmit(values) {
    let data = {
      ...values,
      patient: record.patient,
      practitioner: record.practitioner,
      user,
      activities: record.activities,
      prescriptions: record.prescriptions,
      serviceRatings: record.ratings,
      amount: await record.activities
        .map(activity => activity.value.activityReward)
        .reduce((activity, acc) => activity + acc, 0)
    };

    let interaction = await recordInteraction(data);
    if (interaction.error) {
      toggle({
        isVisible: true,
        message: interaction.error
      });
    } else {
      toggle({
        isVisible: true,
        message: `Interaction has been recorded successfully`
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
            <div className={styles.form_body}>
              <div className={[styles.layout].join(" ")}>
                <div className={styles.layout__item}>
                  <div className={[styles.input].join(" ")}>
                    <label htmlFor="patientIDNumber">Patient ID Number</label>
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
                      formatOptionLabel={formatOptionLabel}
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
                      formatOptionLabel={formatOptionLabel}
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
              {prescriptions.length > 0 && (
                <div className={styles.layout__item}>
                  <label htmlFor="prescriptions">Prescriptions</label>
                  <Select
                    isSearchable
                    value={record.prescriptions}
                    placeholder="Select prescriptions"
                    name={`prescriptions`}
                    isMulti
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
              )}
              <div className={styles.layout__item}>
                {ratingList.length > 0 && (
                  <fieldset>
                    <legend>Rate the services</legend>
                    {ratingList.map((rating, index) => (
                      <Rating key={index} selected={rating} />
                    ))}
                  </fieldset>
                )}
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
            <div className={styles.actions}>
              <Button
                type="button"
                text={"Cancel"}
                onClick={clearDismiss}
                classNames={[styles.button].join(" ")}
              ></Button>
              <Button
                text="Save"
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

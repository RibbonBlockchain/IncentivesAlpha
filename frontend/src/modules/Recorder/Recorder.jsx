import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useForm from "react-hook-form";
import Select from "react-select";
import Button from "../../common/components/Button";
import Modal from "../../common/components/Modal";
import * as moment from "moment";
import styles from "./Recorder.module.scss";
import { SHOW_ALERT } from "../../common/constants/alert";
import { LOAD_DATA } from "../../common/constants/dashboard";
import { getItem, clear } from "../../common/utils/storage";
import { loadUsers, getByRole } from "../Dashboard/dashboard.utils";
import { roleNames, roles } from "../../common/constants/roles";

export default function Recorder() {
  const [visible, setVisible] = useState(false);
  let dispatch = useDispatch();
  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    let users = await loadUsers();
    dispatch({
      type: LOAD_DATA,
      payload: users
    });
  }
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
  const [record, setRecord] = useState({
    patient: {},
    practitioner: {},
    prescriptions: [],
    activities: []
  });
  let dispatch = useDispatch();
  const { data } = useSelector(state => state.dapp);

  let patients = getByRole(data, roleNames.PATIENT);
  let practitioners = getByRole(data, roleNames.PRACTITIONER);
  let activityList = [];
  let prescriptionList = [];

  async function onSubmit(values, e) {
    let data = {
      ...values,
      //   dateOfBirth: moment(date).format("YYYY/M/D"),
      role: type
      //   phoneNumber: phoneNumber.value
    };
    // let newUser = await createNewUser(data);
  }

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" }
  ];
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
                      value={record.patient}
                      placeholder="Patient ID Number"
                      name="patient"
                      onChange={patient =>
                        setRecord({
                          practitioner: record.practitioner,
                          patient,
                          prescriptions: record.prescriptions,
                          activities: record.activities
                        })
                      }
                      options={patients}
                    />
                  </div>
                </div>
                <div className={styles.layout__item}>
                  <div className={[styles.input].join(" ")}>
                    <label htmlFor="practitionerIDNumber">
                      Practitioner ID Number
                    </label>
                    <Select
                      value={record.practitioner}
                      placeholder="Practitioner ID Number"
                      name="practitioner"
                      onChange={practitioner =>
                        setRecord({
                          practitioner,
                          patient: record.patient,
                          prescriptions: record.prescriptions,
                          activities: record.activities
                        })
                      }
                      options={practitioners}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.layout}>
                <div className={styles.layout__item}>
                  <label htmlFor="activity">Activity</label>
                  <Select
                    value={record.activities}
                    placeholder="Select Activity"
                    name="activities"
                    isMulti
                    onChange={activities =>
                      setRecord({
                        practitioner: record.practitioner,
                        patient: record.patient,
                        prescriptions: record.prescriptions,
                        activities
                      })
                    }
                    options={activityList}
                  />
                </div>
                <div className={styles.layout__item}>
                  <label htmlFor="prescriptions">Prescriptions</label>
                  <Select
                    value={record.prescriptions}
                    placeholder="Select prescriptions"
                    name="prescriptions"
                    isMulti
                    onChange={prescriptions =>
                      setRecord({
                        practitioner: record.practitioner,
                        patient: record.patient,
                        prescriptions,
                        activities: record.activities
                      })
                    }
                    options={prescriptionList}
                  />
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

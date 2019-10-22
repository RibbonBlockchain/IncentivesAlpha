import React, { useState } from "react";
import useForm from "react-hook-form";
import Select from "react-select";
import Button from "../../common/components/Button";
import Modal from "../../common/components/Modal";
import styles from "./Recorder.module.scss";
import { getByRole } from "../Dashboard/dashboard.utils";
import { roleNames } from "../../common/constants/roles";
import { recordInteraction } from "./recorder.utils";
import { useWeb3 } from "../../common/providers/Web3.provider";
import { useAlert } from "../../common/providers/Modal.provider";
import { useUsersList } from "../../common/providers/API.provider";

export default function Recorder() {
  const [visible, setVisible] = useState(false);
  const [{ loginType, user }] = useWeb3();
  const [{ users }] = useUsersList();

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
  const [{}, toggle] = useAlert();
  const [record, setRecord] = useState({
    patient: {},
    practitioner: {},
    prescriptions: [],
    activities: []
  });
  let patients = getByRole(users, roleNames.PATIENT);
  let practitioners = getByRole(users, roleNames.PRACTITIONER);
  let activityList = [];
  let prescriptionList = [];

  async function onSubmit(values) {
    let data = {
      ...values,
      patient: record.patient,
      practitioner: record.practitioner,
      user,
      activities: record.activities,
      prescriptions: record.prescriptions
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
                    name={`activities`}
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
                    name={`prescriptions`}
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

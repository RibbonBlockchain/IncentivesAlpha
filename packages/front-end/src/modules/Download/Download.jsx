import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import Button from "../../../common/components/Button";
import Modal from "../../../common/components/Modal";
import { generateReport } from "../../Dashboard/dashboard.utils";
import styles from "./List.module.scss";
import { getItem } from "../../../common/utils/storage";
import { useAlert, useModal } from "../../../common/providers/Modal.provider";

export default function({ isOpen, onDismiss }) {
  const [, toggle] = useAlert();
  const [loading, setLoading] = useState(false);
  const address = getItem("address");
  const [date, setDate] = useState({
    from: new Date(),
    to: new Date(new Date().getTime() + 60 * 60 * 24 * 1000)
  });

  const header = ["firstName", "lastName", "gender"];

  async function generateReportAndDownload() {
    setLoading(true);
    let result = await generateReport(date, address, { header });
    if (result.length > 0) {
      setLoading(false);
      onDismiss();
    } else if (result.error) {
      setLoading(false);
      toggle({
        isVisible: true,
        message: result.error
      });
    }
  }

  return (
    <>
      <Modal
        visible={isOpen}
        windowClassName={styles.modalWindow}
        onClickClose={onDismiss}
      >
        <div className={styles.cnt}>
          <div className={styles.header}>
            <div className={styles.modalFormWindow}>
              <div className={styles.layout__item}>
                <div className={styles.layout__full}>
                  <div className={styles.input}>
                    <label htmlFor="from">From</label>
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      selected={date.from}
                      name="from"
                      selectsStart
                      className={styles.datepicker}
                      placeholderText="from"
                      startDate={date.from}
                      endDate={date.to}
                      onChange={selectedDate =>
                        setDate({
                          from: selectedDate,
                          to: new Date(
                            new Date(selectedDate).getTime() +
                              60 * 60 * 24 * 10000
                          )
                        })
                      }
                    />
                  </div>
                </div>
                <div className={styles.layout__full}>
                  <div className={styles.input}>
                    <label htmlFor="to">To</label>
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      selected={date.to}
                      name="to"
                      selectsEnd
                      className={styles.datepicker}
                      placeholderText="to"
                      endDate={date.to}
                      minDate={date.from}
                      onChange={selectedDate =>
                        setDate({
                          to: selectedDate,
                          from: date.from
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className={styles.actions}>
                <Button
                  text="Download"
                  onClick={generateReportAndDownload}
                  classNames={[styles.button, styles.button_primary].join(" ")}
                  disabled={loading}
                  button="submit"
                ></Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/heading-has-content */
import React, { useState, useEffect } from "react";
import {
  Table,
  AutoSizer,
  Column,
  CellMeasurer,
  CellMeasurerCache
} from "react-virtualized";
import DatePicker from "react-datepicker";
import Fuse from "fuse.js";
import * as moment from "moment";
import Card from "../../../common/components/Card";
import { useData } from "../../../common/providers/API.provider";
import { DesktopLoader } from "../../../common/components/Loader";
import Button from "../../../common/components/Button";
import Modal from "../../../common/components/Modal";
import { generatePrescriptionReport } from "../../Dashboard/dashboard.utils";
import { roleNames } from "../../../common/constants/roles";
import styles from "./List.module.scss";
import { getItem } from "../../../common/utils/storage";
import { useAlert } from "../../../common/providers/Modal.provider";
import { useWeb3 } from "../../../common/providers/Web3.provider";
const cache = new CellMeasurerCache({
  defaultHeight: 100,
  defaultWidth: 100,
  minHeight: 40,
  minWidth: 100,
  fixedWidth: true
});

function DownloadCSV({ isOpen, onDismiss }) {
  const [, toggle] = useAlert();
  const [loading, setLoading] = useState(false);
  const address = getItem("address");
  const [date, setDate] = useState({
    from: new Date(),
    to: new Date(new Date().getTime() + 60 * 60 * 24 * 1000)
  });

  async function generateReportAndDownload() {
    setLoading(true);
    let result = await generatePrescriptionReport(date, address);
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

export default function() {
  const [{ interactions }] = useData();
  const [{ user, loginType }] = useWeb3();
  const [state, setState] = useState([]);
  const [search, setSearch] = useState();
  const [visible, setVisible] = useState(false);
  const fuse = new Fuse(state, {
    maxPatternLength: 32,
    minMatchCharLength: 3,
    keys: ["firstName", "lastName"]
  });

  useEffect(() => {
    fetchMyInteractions();
  }, []);

  async function fetchMyInteractions() {
    if (loginType === roleNames.SUPER_ADMIN) {
      setState(interactions);
    } else {
      let data = interactions.filter(
        interaction => interaction.chw._id === user._id
      );
      setState(data);
    }
  }

  function _noRowsRenderer() {
    return <div className={styles.noRows}>No transaction recorded yet!</div>;
  }

  function renderPrescriptionNumber({ rowData }) {
    return rowData.prescriptionNo ? rowData.prescriptionNo : "Not Available";
  }

  function renderPatient({ rowData }) {
    return (
      <div>
        {rowData.patient &&
        rowData.patient.firstName &&
        rowData.patient.lastName
          ? `${rowData.patient.firstName} ${rowData.patient.lastName} `
          : `Not Available`}
      </div>
    );
  }

  function renderPractitioner({ rowData }) {
    return (
      <div>
        {rowData.practitioner &&
        rowData.practitioner.firstName &&
        rowData.practitioner.lastName
          ? `${rowData.practitioner.firstName} ${rowData.practitioner.lastName} `
          : `Not Available`}
      </div>
    );
  }

  function renderPrescriptions({
    rowData,
    columnIndex,
    key,
    parent,
    rowIndex
  }) {
    return (
      <CellMeasurer
        cache={cache}
        columnIndex={columnIndex}
        key={key}
        parent={parent}
        rowIndex={rowIndex}
      >
        {rowData.prescriptions.length > 0 ? (
          <div style={{ whiteSpace: "normal", padding: "1px" }}>
            {rowData.prescriptions
              .map(prescription => prescription.prescriptionTitle)
              .join(", ")}
          </div>
        ) : (
          <div>Not available</div>
        )}
      </CellMeasurer>
    );
  }

  function renderDate({ rowData }) {
    return <div>{moment(rowData.createdDate).format("DD/MM/YYYY")}</div>;
  }

  function renderTime({ rowData }) {
    return (
      <div>
        {rowData.createdDate
          ? moment(rowData.createdDate).format("HH:mm:ss")
          : "Not Available"}
      </div>
    );
  }

  async function handleSearch(e) {
    let data = await fuse.search(e.target.value);
    if (data.length > 0) {
      setState(data);
    } else {
      return interactions;
    }
  }

  return (
    <>
      {interactions ? (
        <Card classNames={[styles.table].join(" ")}>
          <div className={styles.head_actions}>
            <h4 className={styles.background}></h4>
            <div className={styles.head_actions_action}>
              <Button
                onClick={() => setVisible(true)}
                className={styles.csv_button}
                text="Download"
              />
              <input
                className={[styles.form_input].join(" ")}
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Query record"
              />
            </div>
          </div>
          <div style={{ flex: "1 1 auto", height: "79vh" }}>
            <AutoSizer>
              {({ height, width }) => (
                <Table
                  width={width}
                  height={height}
                  headerHeight={40}
                  noRowsRenderer={_noRowsRenderer}
                  rowHeight={cache.rowHeight}
                  rowCount={interactions.length}
                  rowGetter={({ index }) => interactions[index]}
                  rowClassName={styles.ReactVirtualized__Table__rowColumn}
                  headerClassName={[
                    styles.ReactVirtualized__Table__headerColumn
                  ].join(" ")}
                >
                  <Column
                    label="Practitioner"
                    cellRenderer={renderPractitioner}
                    dataKey="practitionerAddress"
                    width={width - 200}
                  />
                  <Column
                    label="Patient"
                    cellRenderer={renderPatient}
                    dataKey="patientAddress"
                    width={width - 200}
                  />
                  <Column
                    label="Prescription"
                    cellRenderer={renderPrescriptions}
                    dataKey="prescriptions"
                    width={width - 200}
                  />
                  <Column
                    label="Prescription Number"
                    cellRenderer={renderPrescriptionNumber}
                    dataKey="prescriptionNo"
                    width={width - 200}
                  />
                  <Column
                    label="Date"
                    cellRenderer={renderDate}
                    dataKey="createdDate"
                    width={width - 200}
                  />
                  <Column
                    label="Time"
                    cellRenderer={renderTime}
                    dataKey="createdDate"
                    width={width - 500}
                  />
                </Table>
              )}
            </AutoSizer>
          </div>
        </Card>
      ) : (
        <DesktopLoader />
      )}
      <DownloadCSV isOpen={visible} onDismiss={() => setVisible(false)} />
    </>
  );
}

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Table, AutoSizer, Column } from "react-virtualized";
import DatePicker from "react-datepicker";
import Fuse from "fuse.js";
import * as moment from "moment";
import Card from "../../../common/components/Card";
import { Link } from "../../../common/theme";
import { useData } from "../../../common/providers/API.provider";
import { getBlockscoutLink } from "../../../common/utils";
import { roleNames } from "../../../common/constants/roles";
import { DesktopLoader } from "../../../common/components/Loader";
import Button from "../../../common/components/Button";
import Modal from "../../../common/components/Modal";
import { generateReport } from "../../Dashboard/dashboard.utils";
import styles from "./List.module.scss";
import { getItem } from "../../../common/utils/storage";
import { useAlert } from "../../../common/providers/Modal.provider";

const StyledTitle = styled.h3`
  font-weight: 300;
`;
const StyledDate = styled(StyledTitle)``;

const StyledAddress = styled(Link)``;

function DownloadCSV({ isOpen, onDismiss }) {
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

export default function ListPractitioners() {
  const [{ users }] = useData();
  const [state, setState] = useState([]);
  const [search, setSearch] = useState();
  const [visible, setVisible] = useState(false);
  const fuse = new Fuse(state, {
    maxPatternLength: 32,
    minMatchCharLength: 3,
    keys: ["firstName", "lastName"]
  });

  useEffect(() => {
    fetchPatientsOnly();
  }, []);

  async function fetchPatientsOnly() {
    let patients = [];
    await users.map(user => {
      if (user.role === roleNames.PATIENT) {
        patients.push(user);
      } else {
        return;
      }
    });
    setState(patients);
  }

  function _noRowsRenderer() {
    return <div className={styles.noRows}>No transaction recorded yet!</div>;
  }

  function renderName({ rowData }) {
    return (
      <StyledTitle>
        {rowData && rowData.firstName && rowData.lastName
          ? `${rowData.firstName} ${rowData.lastName} `
          : `Not Available`}
      </StyledTitle>
    );
  }

  function renderAddress({ rowData }) {
    return (
      <StyledTitle>
        <StyledAddress
          href={getBlockscoutLink(rowData.publicAddress, "address")}
        >
          {rowData.publicAddress}
        </StyledAddress>
      </StyledTitle>
    );
  }

  function renderDate({ rowData }) {
    return (
      <StyledDate>
        {moment(rowData.createdDate).format("dddd, MMMM Do YYYY")}
      </StyledDate>
    );
  }

  async function handleSearch(e) {
    let data = await fuse.search(e.target.value);
    if (data.length > 0) {
      setState(data);
    } else {
      fetchPatientsOnly();
    }
  }

  return (
    <>
      {state ? (
        <Card classNames={[styles.table, styles.white].join(" ")}>
          <div className={styles.head_actions}>
            <h4 className={styles.background}></h4>
            <div className={styles.head_actions_action}>
              <Button
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
          <AutoSizer disableHeight>
            {({ width }) => (
              <Table
                width={width}
                height={500}
                headerHeight={40}
                noRowsRenderer={_noRowsRenderer}
                rowHeight={40}
                rowCount={state.length}
                rowGetter={({ index }) => state[index]}
                headerClassName={[
                  styles.ReactVirtualized__Table__headerColumn
                ].join(" ")}
              >
                <Column
                  label="Patient"
                  cellRenderer={renderName}
                  dataKey="patientAddress"
                  className={styles.ReactVirtualized__Table__rowColumn_ticker}
                  width={300}
                />
                <Column
                  label="Wallet Address"
                  cellRenderer={renderAddress}
                  dataKey="patientAddress"
                  className={styles.ReactVirtualized__Table__rowColumn_ticker}
                  width={500}
                />
                <Column
                  label="Date Registered"
                  cellRenderer={renderDate}
                  dataKey="createdDate"
                  className={styles.ReactVirtualized__Table__rowColumn_ticker}
                  width={300}
                />
              </Table>
            )}
          </AutoSizer>
        </Card>
      ) : (
        <DesktopLoader />
      )}
      <DownloadCSV isOpen={visible} onDismiss={() => setVisible(false)} />
    </>
  );
}

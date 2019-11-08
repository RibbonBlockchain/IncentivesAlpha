import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Table, AutoSizer, Column } from "react-virtualized";
import Fuse from "fuse.js";
import * as moment from "moment";
import Card from "../../../common/components/Card";
import { Link } from "../../../common/theme";
import { useData } from "../../../common/providers/API.provider";
import { getBlockscoutLink } from "../../../common/utils";
import { roleNames } from "../../../common/constants/roles";
import styles from "../../Dashboard/Dashboard.module.scss";
import { DesktopLoader } from "../../../common/components/Loader";
import Button from "../../../common/components/Button";
import Modal from "../../../common/components/Modal";

const StyledTitle = styled.h3`
  font-weight: 300;
`;
const StyledDate = styled(StyledTitle)``;

const StyledAddress = styled(Link)``;

function DownloadCSV({ isOpen, onDismiss }) {
  return (
    <>
      <Modal
        visible={isOpen}
        windowClassName={styles.modalWindow}
        onClickClose={onDismiss}
      >
        <div className={styles.cnt}>
          <div className={styles.header}></div>
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
    fetchPractionersOnly();
  }, []);

  async function fetchPractionersOnly() {
    let practitioners = [];
    await users.map(user => {
      if (user.role === roleNames.PRACTITIONER) {
        practitioners.push(user);
      } else {
        return;
      }
    });
    setState(practitioners);
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
      fetchPractionersOnly();
    }
  }

  return (
    <>
      {state ? (
        <Card classNames={[styles.table, styles.white].join(" ")}>
          <div className={styles.head_actions}>
            <h4>Interactions</h4>
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
                  label="Practitioner"
                  cellRenderer={renderName}
                  dataKey="practitionerAddress"
                  className={styles.ReactVirtualized__Table__rowColumn_ticker}
                  width={300}
                />
                <Column
                  label="Wallet Address"
                  cellRenderer={renderAddress}
                  dataKey="practitionerAddress"
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

import React, { useState } from "react";
import useForm from "react-hook-form";
import { useData } from "../../common/providers/API.provider";
import { useWeb3 } from "../../common/providers/Web3.provider";
import { Table, AutoSizer, Column } from "react-virtualized";
import { getRoleCount } from "./dashboard.utils";
import { roleNames } from "../../common/constants/roles";
import Card from "../../common/components/Card";
import Button from "../../common/components/Button";
import { useModal } from "../../common/providers/Modal.provider";
import { DesktopLoader } from "../../common/components/Loader";
import * as moment from "moment";
import styles from "./Dashboard.module.scss";

function DashboardTable({ data, type }) {
  const [, toggleModal] = useModal();

  function _noRowsRenderer() {
    return <div className={styles.noRows}>No transaction recorded yet!</div>;
  }

  function _rowClassName({ index }) {
    if (index < 0) {
      return styles.headerRow;
    } else {
      return index % 2 === 0 ? styles.evenRow : styles.oddRow;
    }
  }

  function renderTxLink({ rowData }) {
    return (
      <a href={`https://blockscout.com/poa/sokol/tx/${rowData.txn_hash}`}>
        {rowData.txt_hash}
      </a>
    );
  }

  function renderStatus({ rowData }) {
    return <>{rowData.status == 1 ? "Confirmed" : "Failed"}</>;
  }

  function renderDate({ rowData }) {
    return <>{moment(rowData.txn_date).utc()}</>;
  }

  return (
    <>
      {roleNames.SUPER_ADMIN === type && (
        <div className={styles.actions}>
          <Button
            onClick={() =>
              toggleModal({ isVisible: true, modal: "donate", data: null })
            }
            classNames={styles.button_primary}
            text="Donate"
          />
        </div>
      )}
      <Card classNames={[styles.table, styles.card__white].join(" ")}>
        <AutoSizer disableHeight>
          {({ width }) => (
            <Table
              width={width}
              height={400}
              headerHeight={40}
              noRowsRenderer={_noRowsRenderer}
              rowHeight={40}
              rowCount={data.length}
              rowClassName={_rowClassName}
              rowGetter={({ index }) => data[index]}
              headerClassName={[
                styles.ReactVirtualized__Table__headerColumn
              ].join(" ")}
            >
              <Column
                label="Date"
                cellRenderer={renderDate}
                dataKey="date"
                className={styles.ReactVirtualized__Table__rowColumn_ticker}
                width={200}
              />
              {type !== roleNames.PRACTITIONER && (
                <Column
                  label="Practitioner"
                  cellRenderer={renderTxLink}
                  dataKey="practitioner"
                  className={styles.ReactVirtualized__Table__rowColumn_ticker}
                  width={300}
                />
              )}
              {type !== roleNames.PATIENT && (
                <Column
                  label="Patient"
                  cellRenderer={renderTxLink}
                  dataKey="patient"
                  className={styles.ReactVirtualized__Table__rowColumn_ticker}
                  width={300}
                />
              )}
              <Column
                label="Interactions"
                cellRenderer={renderTxLink}
                dataKey="interactions"
                className={styles.ReactVirtualized__Table__rowColumn_ticker}
                width={300}
              />
              {type < roleNames.HEALTH_WORKER && (
                <Column
                  label="Registered By"
                  cellRenderer={renderStatus}
                  dataKey="chw"
                  className={styles.ReactVirtualized__Table__rowColumn_ticker}
                  width={200}
                />
              )}
              <Column
                label="Total Payout"
                cellRenderer={renderStatus}
                dataKey="payout"
                className={styles.ReactVirtualized__Table__rowColumn_ticker}
                width={200}
              />
              <Column
                label="Status"
                cellRenderer={renderStatus}
                dataKey="status"
                className={styles.ReactVirtualized__Table__rowColumn_ticker}
                width={100}
              />
            </Table>
          )}
        </AutoSizer>
      </Card>
    </>
  );
}

function Stats({ users, type }) {
  return (
    <div className={styles.dashboard}>
      {roleNames.SUPER_ADMIN === type && (
        <div className={styles.layout}>
          <Card classNames={styles.card__light_orange}>
            <div className={styles.count}>
              {getRoleCount(users, roleNames.PATIENT)}
            </div>
            <div className={styles.heading}>Patients Registered</div>
          </Card>
          <Card classNames={styles.card__light_blue}>
            <div className={styles.count}>
              {getRoleCount(users, roleNames.PRACTITIONER)}
            </div>
            <div className={styles.heading}>Practitioners Registered</div>
          </Card>
          <Card classNames={styles.card__light_pink}>
            <div className={styles.count}>
              {getRoleCount(users, roleNames.HEALTH_WORKER)}
            </div>
            <div className={styles.heading}>
              Community Health Workers Registered
            </div>
          </Card>
          <Card classNames={styles.card__light_purple}>
            <div className={styles.count}>
              {getRoleCount(users, roleNames.SUPER_ADMIN)}
            </div>
            <div className={styles.heading}>Administrators</div>
          </Card>
        </div>
      )}
      {roleNames.HEALTH_WORKER === type && (
        <div className={styles.layout}>
          <Card classNames={styles.card__light_orange}>
            <div className={styles.count}>
              {getRoleCount(users, roleNames.PATIENT)}
            </div>
            <div className={styles.heading}>Patients Registered</div>
          </Card>
          <Card classNames={styles.card__light_blue}>
            <div className={styles.count}>
              {getRoleCount(users, roleNames.PRACTITIONER)}
            </div>
            <div className={styles.heading}>Practitioners Registered</div>
          </Card>
        </div>
      )}
      {roleNames.PRACTITIONER === type && (
        <div className={styles.layout}>
          <Card classNames={styles.card__light_orange}>
            <div className={styles.count}>0</div>
            <div className={styles.heading}>Transactions completed</div>
          </Card>
          <Card classNames={styles.card__light_pink}>
            <div className={styles.count}>0</div>
            <div className={styles.heading}>Transactions Failed</div>
          </Card>
        </div>
      )}
      {roleNames.PATIENT === type && (
        <div className={styles.layout}>
          <Card classNames={styles.card__light_orange}>
            <div className={styles.count}>0</div>
            <div className={styles.heading}>Transactions completed</div>
          </Card>
          <Card classNames={styles.card__light_pink}>
            <div className={styles.count}>0</div>
            <div className={styles.heading}>Transactions Failed</div>
          </Card>
        </div>
      )}
    </div>
  );
}

function HandleViews({ type, transactions }) {
  switch (type) {
    case roleNames.SUPER_ADMIN:
      return <DashboardTable type={type} data={transactions} />;
    case roleNames.HEALTH_WORKER:
      return <DashboardTable type={type} data={transactions} />;
    case roleNames.PRACTITIONER:
      return <DashboardTable type={type} data={transactions} />;
    case roleNames.PATIENT:
      return <DashboardTable type={type} data={transactions} />;
    default:
      // todo replace this with 404 page
      throw new Error("Unknown Type");
  }
}

export default function Dashboard() {
  const [{ address, loginType }] = useWeb3();
  const [{ users, interactions }] = useData();

  return (
    <>
      {address && typeof loginType === "number" ? (
        <>
          <Stats type={Number(loginType)} users={users} />
          {loginType !== null && (
            <HandleViews transactions={interactions} type={loginType} />
          )}
        </>
      ) : (
        <DesktopLoader />
      )}
    </>
  );
}

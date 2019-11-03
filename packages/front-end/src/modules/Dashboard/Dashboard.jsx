import React, { useEffect } from "react";
import * as moment from "moment";
import { useData } from "../../common/providers/API.provider";
import { useWeb3 } from "../../common/providers/Web3.provider";
import {
  VirtualizedTable,
  Column,
  AutoSizer
} from "../../common/components/Table";
import { getRoleCount } from "./dashboard.utils";
import { roleNames } from "../../common/constants/roles";
import Card from "../../common/components/Card";
import Button from "../../common/components/Button";
import { useModal } from "../../common/providers/Modal.provider";
import { DesktopLoader } from "../../common/components/Loader";
import { Link, Heading } from "../../common/theme";
import styles from "./Dashboard.module.scss";
import { getBlockscoutLink } from "../../common/utils";

function DashboardTable({ data, type }) {
  const [, toggleModal] = useModal();

  //   function _noRowsRenderer() {
  //     return <div className={styles.noRows}>No transaction recorded yet!</div>;
  //   }

  function renderTxLink({ rowData }) {
    return (
      <Heading>
        <Link href={getBlockscoutLink(rowData.txn_hash, "transaction")}>
          {rowData.txt_hash}
        </Link>
      </Heading>
    );
  }

  function renderPatient({ rowData }) {
    return (
      <Heading>
        {rowData.patient &&
        rowData.patient.firstName &&
        rowData.patient.lastName
          ? `${rowData.patient.firstName} ${rowData.patient.lastName} `
          : `Not Available`}
      </Heading>
    );
  }

  function renderPractitioner({ rowData }) {
    return (
      <Heading>
        {rowData.practitioner &&
        rowData.practitioner.firstName &&
        rowData.practitioner.lastName
          ? `${rowData.practitioner.firstName} ${rowData.practitioner.lastName} `
          : `Not Available`}
      </Heading>
    );
  }

  function renderHealthWorker({ rowData }) {
    return (
      <Heading>
        {rowData.chw && rowData.chw.firstName && rowData.chw.lastName
          ? `${rowData.chw.firstName} ${rowData.chw.lastName} `
          : `Not Available`}
      </Heading>
    );
  }

  function renderDate({ rowData }) {
    return (
      <Heading>
        {rowData.createdDate
          ? moment(rowData.createdDate)
              .utc()
              .format("dddd, MMMM Do YYYY HH:mm")
          : "Not Available"}
      </Heading>
    );
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
      <VirtualizedTable
        headerHeight={40}
		rowHeight={40}
        rowCount={data.length}
        rowGetter={({ index }) => data[index]}
      >
        {type !== roleNames.PRACTITIONER && (
          <Column
            label="Practitioner"
            cellRenderer={renderPractitioner}
            dataKey="practitionerAddress"
            width={300}
          />
        )}
        {type !== roleNames.PATIENT && (
          <Column
            label="Patient"
            cellRenderer={renderPatient}
            dataKey="patientAddress"
            width={300}
          />
        )}
        {type < roleNames.HEALTH_WORKER && (
          <Column
            label="Registered By"
            cellRenderer={renderHealthWorker}
            dataKey="chwAddress"
            width={200}
          />
        )}
        <Column
          label="Date"
          cellRenderer={renderDate}
          dataKey="createdDate"
          width={300}
        />
      </VirtualizedTable>
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
  const [{ address, loginType }, , getWalletDetails] = useWeb3();
  const [{ users, interactions }, fetchData] = useData();

  useEffect(() => {
    loadData();
  }, [loginType]);

  const loadData = async () => {
    await getWalletDetails();
    await fetchData();
  };

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

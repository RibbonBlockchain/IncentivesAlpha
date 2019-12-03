import React from "react";
import * as moment from "moment";
import {
  Table,
  AutoSizer,
  Column,
  CellMeasurer,
  CellMeasurerCache
} from "react-virtualized";
import Modal from "../../common/components/Modal";
import Blockies from "../../common/components/Blockies";
import { roles, roleNames } from "../../common/constants/roles";
import { useModal } from "../../common/providers/Modal.provider";
import { useWeb3 } from "../../common/providers/Web3.provider";
import { useApp } from "../../common/providers/App.provider";
import styles from "./User.module.scss";

const cache = new CellMeasurerCache({
  defaultHeight: 100,
  defaultWidth: 100,
  minHeight: 40,
  minWidth: 100,
  fixedWidth: true
});

function Profile({ data: { data, activities }, currency, type }) {
  function _noRowsRenderer() {
    return <div className={styles.noRows}>No transaction recorded yet!</div>;
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

  function renderInteractions({
    rowData,
    columnIndex,
    key,
    relatedTo,
    rowIndex
  }) {
    return (
      <CellMeasurer
        cache={cache}
        columnIndex={columnIndex}
        key={key}
        relatedTo={relatedTo}
        rowIndex={rowIndex}
      >
        {rowData.activities.length > 0 ? (
          <div style={{ whiteSpace: "normal", padding: "1px" }}>
            {rowData.activities
              .map(activity => activity.activityTitle)
              .join(", ")}
          </div>
        ) : (
          <div>Not available</div>
        )}
      </CellMeasurer>
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

  function renderHealthWorker({ rowData }) {
    return (
      <div>
        {rowData.chw && rowData.chw.firstName && rowData.chw.lastName
          ? `${rowData.chw.firstName} ${rowData.chw.lastName} `
          : `Not Available`}
      </div>
    );
  }

  function renderDate({ rowData }) {
    return <div>{moment(rowData.createdDate).format("DD/MM/YYYY")}</div>;
  }

  function renderTime({ rowData }) {
    return (
      <div>
        {rowData.createdDate
          ? moment(rowData.createdDate).format("hh:mm:ss")
          : "Not Available"}
      </div>
    );
  }

  function renderRewards({ rowData }) {
    let totalTokenSent = "0.00";
    switch (type) {
      case roleNames.HEALTH_WORKER:
        totalTokenSent = rowData.rewards[0].chwReward;
        break;
      case roleNames.PRACTITIONER:
        totalTokenSent = rowData.rewards[0].practitionerReward;
        break;
      case roleNames.PATIENT:
        totalTokenSent = rowData.rewards[0].patientReward;
        break;
      default:
        totalTokenSent = 0.0;
        break;
    }
    return <div>{`${Number(totalTokenSent).toFixed(4)} ${currency}`}</div>;
  }
  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        {data.publicAddress ? (
          <Blockies
            className={styles.blockies}
            address={data.publicAddress}
            imageSize={40}
          />
        ) : (
          <Blockies
            className={styles.blockies}
            address={data.relatedTo.publicAddress}
            imageSize={40}
          />
        )}
      </div>
      <div className={styles.information}>
        <h4
          className={styles.header}
        >{`${data.lastName} ${data.firstName}`}</h4>
        <span className={styles.heading}>
          ID Number: <strong>{data.idNumber}</strong>
        </span>
        <div className={styles.wallet}>
          <small>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://blockscout.com/poa/sokol/address/${
                data.publicAddress
                  ? data.publicAddress
                  : data.relatedTo.publicAddress
              }`}
            >
              {data.publicAddress
                ? data.publicAddress
                : data.relatedTo.publicAddress}
            </a>
          </small>
        </div>
        <div className={styles.description}>
          <span className={styles.heading}>Role: </span>
          <span className={styles.wrapper}>
            {data.role && roles[data.role].replace("_", " ")}
          </span>
        </div>
        <div className={styles.dob}>
          <span className={styles.heading}>Date of Birth: </span>
          <span className={styles.wrapper}>
            {moment(data.dateofbirth).format("DD/MM/YYYY")}
          </span>
        </div>
      </div>
      <div style={{ flex: "1 1 auto", height: "60vh" }}>
        <AutoSizer>
          {({ height, width }) => {
            return (
              <Table
                width={width}
                height={height}
                headerHeight={40}
                noRowsRenderer={_noRowsRenderer}
                rowHeight={cache.rowHeight}
                rowCount={activities.length}
                rowGetter={({ index }) => activities[index]}
                rowClassName={styles.ReactVirtualized__Table__rowColumn}
                headerClassName={[
                  styles.ReactVirtualized__Table__headerColumn
                ].join(" ")}
              >
                <Column
                  label="Interactions"
                  cellRenderer={renderInteractions}
                  dataKey="activities"
                  width={width - 200}
                />
                {type < roleNames.HEALTH_WORKER && (
                  <Column
                    label="Registered By"
                    cellRenderer={renderHealthWorker}
                    dataKey="chwAddress"
                    width={width - 200}
                  />
                )}
                {type !== roleNames.PRACTITIONER && (
                  <Column
                    label="Practitioner"
                    cellRenderer={renderPractitioner}
                    dataKey="practitionerAddress"
                    width={width - 200}
                  />
                )}
                {type !== roleNames.PATIENT && (
                  <Column
                    label="Patient"
                    cellRenderer={renderPatient}
                    dataKey="patientAddress"
                    width={width - 200}
                  />
                )}
                {type !== roleNames.SUPER_ADMIN && (
                  <Column
                    label="Tokens earned"
                    cellRenderer={renderRewards}
                    dataKey="rewards"
                    width={width - 200}
                  />
                )}
                <Column
                  label="Date"
                  dataKey="createdDate"
                  width={width - 200}
                  cellRenderer={renderDate}
                />
                <Column
                  label="Time"
                  dataKey="createdDate"
                  width={width - 500}
                  cellRenderer={renderTime}
                />
              </Table>
            );
          }}
        </AutoSizer>
      </div>
    </div>
  );
}
function UserDetails() {
  const [{ isVisible, data, modal }, toggleModal] = useModal();
  const [{ loginType, balance }] = useWeb3();
  const [{ currency }] = useApp();

  function onClickClose() {
    toggleModal({
      isVisible: false,
      data: null,
      modal: null
    });
  }

  let isOpen = isVisible && modal === "details";
  let details = {
    balance,
    role: loginType
  };
  return (
    <Modal
      visible={isOpen}
      onClickClose={onClickClose}
      windowClassName={styles.modalWindow}
    >
      <div className={styles.cnt}>
        <Profile
          type={loginType}
          user={details}
          data={data}
          currency={currency}
        />
      </div>
    </Modal>
  );
}

export default UserDetails;

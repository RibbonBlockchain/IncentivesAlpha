import React, { useEffect } from "react";
import * as moment from "moment";
import { useData } from "../../common/providers/API.provider";
import { useWeb3 } from "../../common/providers/Web3.provider";
import { useApp } from "../../common/providers/App.provider";
import {
  Table,
  AutoSizer,
  Column,
  CellMeasurer,
  CellMeasurerCache
} from "react-virtualized";
import { roleNames } from "../../common/constants/roles";
import Card from "../../common/components/Card";
import { DesktopLoader } from "../../common/components/Loader";
import styles from "./Dashboard.module.scss";

const cache = new CellMeasurerCache({
  defaultHeight: 100,
  defaultWidth: 100,
  minHeight: 40,
  minWidth: 100,
  fixedWidth: true
});

function DashboardTable({ data, type }) {
  const [{ currency }] = useApp();
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

  function renderInteractions({ rowData, columnIndex, key, parent, rowIndex }) {
    return (
      <CellMeasurer
        cache={cache}
        columnIndex={columnIndex}
        key={key}
        parent={parent}
        rowIndex={rowIndex}
      >
        <div style={{ whiteSpace: "normal" }}>
          {rowData.activities
            .map(activity => activity.activityTitle)
            .join(", ")}
        </div>
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
    return (
      <div>
        {rowData.createdDate
          ? moment(rowData.createdDate)
              .utc()
              .format("DD/MM/YYYY")
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
    <>
      <Card classNames={[styles.table].join(" ")}>
        <div style={{ flex: "1 1 auto", height: "60vh" }}>
          <AutoSizer>
            {({ height, width }) => {
              return (
                <Table
                  deferredMeasurementCache={cache}
                  width={width}
                  height={height}
                  headerHeight={40}
                  noRowsRenderer={_noRowsRenderer}
                  rowHeight={cache.rowHeight}
                  rowCount={data.length}
                  rowGetter={({ index }) => data[index]}
                  rowClassName={styles.ReactVirtualized__Table__rowColumn}
                  headerClassName={[
                    styles.ReactVirtualized__Table__headerColumn
                  ].join(" ")}
                >
                  {type > roleNames.SUPER_ADMIN && (
                    <Column
                      label="Interactions"
                      cellRenderer={renderInteractions}
                      dataKey="activities"
                      width={width - 200}
                    />
                  )}
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
                  <Column
                    label="Tokens earned"
                    cellRenderer={renderRewards}
                    dataKey="rewards"
                    width={width - 200}
                  />
                  <Column
                    label="Date"
                    dataKey="createdDate"
                    width={width - 200}
                    cellRenderer={renderDate}
                  />
                </Table>
              );
            }}
          </AutoSizer>
        </div>
      </Card>
    </>
  );
}

function Stats({ type, dashboard }) {
  const [{ currency }] = useApp();
  return (
    <div className={styles.dashboard}>
      {roleNames.SUPER_ADMIN === type && (
        <div className={styles.layout}>
          <Card classNames={styles.card__light_orange}>
            <div className={styles.count}>
              <span>{dashboard.admin.patients.thisWeekData}</span>
              <span>{dashboard.admin.patients.lastWeekData}</span>
            </div>
            <div className={styles.div}>Patients Registered</div>
          </Card>
          <Card classNames={styles.card__light_blue}>
            <div className={styles.count}>
              {dashboard.admin.practitioners.thisWeekData}/
              {dashboard.admin.practitioners.lastWeekData}
            </div>
            <div className={styles.div}>Practitioners Registered</div>
          </Card>
          <Card classNames={styles.card__light_pink}>
            <div className={styles.count}>
              {dashboard.admin.chw.thisWeekData}/
              {dashboard.admin.chw.lastWeekData}
            </div>
            <div className={styles.div}>
              Community Health Workers Registered
            </div>
          </Card>
          <Card classNames={styles.card__light_purple}>
            <div className={styles.count}>
              {dashboard.admin.admin.thisWeekData}/
              {dashboard.admin.admin.lastWeekData}
            </div>
            <div className={styles.div}>Administrators</div>
          </Card>
        </div>
      )}
      {roleNames.HEALTH_WORKER === type && (
        <div className={styles.layout}>
          <Card classNames={styles.card__light_orange}>
            <div className={styles.div}>
              <div className={styles.count}>
                <div className={styles.count_item}>
                  <div className={styles.count_item__heading}>This month</div>
                  <div className={styles.count_item__data}>
                    {dashboard.chw.patients.lastWeekData}
                  </div>
                </div>
                <div className={styles.count_item}>
                  <div className={styles.count_item__heading}>This week</div>
                  <div className={styles.count_item__data}>
                    {dashboard.chw.patients.thisWeekData}
                  </div>
                </div>
              </div>
              <div className={styles.total}>
                {dashboard.chw.patients.overall}
              </div>
            </div>
            <div className={styles.title}>Patients Registered</div>
          </Card>
          <Card classNames={styles.card__light_orange}>
            <div className={styles.div}>
              <div className={styles.count}>
                <div className={styles.count_item}>
                  <div className={styles.count_item__heading}>This month</div>
                  <div className={styles.count_item__data}>
                    {dashboard.chw.practitioners.lastWeekData}
                  </div>
                </div>
                <div className={styles.count_item}>
                  <div className={styles.count_item__heading}>This week</div>
                  <div className={styles.count_item__data}>
                    {dashboard.chw.practitioners.thisWeekData}
                  </div>
                </div>
              </div>
              <div className={styles.total}>
                {dashboard.chw.practitioners.overall}
              </div>
            </div>
            <div className={styles.title}>Practitioners Registered</div>
          </Card>
          <Card classNames={styles.card__light_orange}>
            <div className={styles.div}>
              <div className={styles.count}>
                <div className={styles.count_item}>
                  <div className={styles.count_item__heading}>This month</div>
                  <div className={styles.count_item__data}>
                    {dashboard.chw.interactions.lastWeekData}
                  </div>
                </div>
                <div className={styles.count_item}>
                  <div className={styles.count_item__heading}>This week</div>
                  <div className={styles.count_item__data}>
                    {dashboard.chw.interactions.thisWeekData}
                  </div>
                </div>
              </div>
              <div className={styles.total}>
                {dashboard.chw.interactions.overall}
              </div>
            </div>
            <div className={styles.title}>Interactions recorded</div>
          </Card>
          <Card classNames={[styles.card__light_pink, styles.card].join(" ")}>
            <div className={styles.div}>
              <div className={styles.count}>
                <div className={styles.count_item}>
                  <div className={styles.count_item__data}>
                    {`${dashboard.chw.interactions.overall}%`}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.title}>Rating Score</div>
          </Card>
        </div>
      )}
      {roleNames.PRACTITIONER === type && (
        <div className={styles.layout}>
          <Card classNames={styles.card__light_orange}>
            <div className={styles.div}>
              <div className={styles.count}>
                <div className={styles.count_item}>
                  <div className={styles.count_item__heading}>This month</div>
                  <div className={styles.count_item__data}>
                    {dashboard.practitioner.lastWeekData}
                  </div>
                </div>
                <div className={styles.count_item}>
                  <div className={styles.count_item__heading}>This week</div>
                  <div className={styles.count_item__data}>
                    {dashboard.practitioner.thisWeekData}
                  </div>
                </div>
              </div>
              <div className={styles.total}>
                {dashboard.practitioner.overall}
              </div>
            </div>
            <div className={styles.title}>Interactions participated in</div>
          </Card>
          <Card classNames={[styles.card__light_pink, styles.card].join(" ")}>
            <div className={styles.div}>
              <div className={styles.count}>
                <div className={styles.count_item}>
                  <div className={styles.count_item__data}>
                    {`${
                      dashboard.practitioner.overall
                    } ${currency.toString().toUpperCase()}`}
                  </div>
                </div>
              </div>
              <div className={styles.total}>
                {dashboard.practitioner.overall}
              </div>
            </div>
            <div className={styles.title}>Total earned</div>
          </Card>
          <Card classNames={[styles.card__light_pink, styles.card].join(" ")}>
            <div className={styles.div}>
              <div className={styles.count}>
                <div className={styles.count_item}>
                  <div className={styles.count_item__data}>
                    {`${dashboard.practitioner.overall}%`}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.title}>Rating Score</div>
          </Card>
        </div>
      )}
      {roleNames.PATIENT === type && (
        <div className={styles.layout}>
          <Card classNames={styles.card__light_orange}>
            <div className={styles.div}>
              <div className={styles.count}>
                <div className={styles.count_item}>
                  <div className={styles.count_item__heading}>This month</div>
                  <div className={styles.count_item__data}>
                    {dashboard.patient.lastWeekData}
                  </div>
                </div>
                <div className={styles.count_item}>
                  <div className={styles.count_item__heading}>This week</div>
                  <div className={styles.count_item__data}>
                    {dashboard.patient.thisWeekData}
                  </div>
                </div>
              </div>
              <div className={styles.total}>{dashboard.patient.overall}</div>
            </div>
            <div className={styles.title}>Interactions participated in</div>
          </Card>
          <Card classNames={[styles.card__light_pink, styles.card].join(" ")}>
            <div className={styles.div}>
              <div className={styles.count}>
                <div className={styles.count_item}>
                  <div className={styles.count_item__data}>
                    {`${
                      dashboard.patient.overall
                    } ${currency.toString().toUpperCase()}`}
                  </div>
                </div>
              </div>
              <div className={styles.total}>{dashboard.patient.overall}</div>
            </div>
            <div className={styles.title}>Total earned</div>
          </Card>
          <Card classNames={[styles.card__light_pink, styles.card].join(" ")}>
            <div className={styles.div}>
              <div className={styles.count}>
                <div className={styles.count_item}>
                  <div className={styles.count_item__data}>
                    {`${dashboard.patient.overall}%`}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.title}>Rating Score</div>
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
  const [{ users, interactions, dashboard }, fetchData] = useData();

  useEffect(() => {
    const loadData = async () => {
      await getWalletDetails();
      await fetchData();
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginType]);

  return (
    <>
      {users && address && typeof loginType === "number" ? (
        <>
          <Stats type={Number(loginType)} dashboard={dashboard} />
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

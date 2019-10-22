import React, { useState } from "react";
import useForm from "react-hook-form";
import {
  useUsersList,
  useTransactions
} from "../../common/providers/API.provider";
import { useWeb3 } from "../../common/providers/Web3.provider";
import { useAlert } from "../../common/providers/Modal.provider";
import { Table, AutoSizer, Column } from "react-virtualized";
import { getRoleCount, makeDonation } from "./dashboard.utils";
import { roleNames } from "../../common/constants/roles";
import Card from "../../common/components/Card";
import Button from "../../common/components/Button";
import Modal from "../../common/components/Modal";
import { DesktopLoader } from "../../common/components/Loader";
import * as moment from "moment";
import styles from "./Dashboard.module.scss";

function DashboardTable({ data, type }) {
  const [donateModal, setDonateModal] = useState(false);

  function _noRowsRenderer() {
    return <div className={styles.noRows}>No data found</div>;
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

  const DonationModal = ({ visible }) => {
    const [{ message }, toggle] = useAlert();
    const { handleSubmit, register, errors, formState } = useForm({
      mode: "onChange"
    });

    async function onSubmit(values, e) {
      let data = {
        value: Number(values.amount),
        message: values.message
      };
      let result = await makeDonation(data);
      toggle({
        isVisible: true,
        message: result.message,
        data: {}
      });

      e.target.reset();
    }
    return (
      <Modal visible={visible && !message} windowClassName={styles.modalWindow}>
        <div className={styles.cnt}>
          <h4>Make Donation</h4>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles.modalFormWindow}
          >
            <div className={styles.layout__item}>
              <div className={[styles.input].join(" ")}>
                <label htmlFor="amount">Amount in (eth)</label>
                <input
                  className={[styles.form_input].join(" ")}
                  placeholder="amount"
                  name="amount"
                  type="number"
                  step={0.0001}
                  ref={register({
                    required: "Amount is required",
                    pattern: {}
                  })}
                />
                <small> {errors.amount && errors.amount.message}</small>
              </div>
            </div>
            <div className={styles.layout__item}>
              <div className={[styles.input].join(" ")}>
                <label htmlFor="message">Message</label>
                <textarea
                  className={[styles.form_input].join(" ")}
                  placeholder="message (optional)"
                  name="message"
                  ref={register}
                />
                <small> {errors.message && errors.message.message}</small>
              </div>
            </div>
            <div className={styles.actions}>
              <Button
                type="button"
                text={"Cancel"}
                classNames={[styles.button].join(" ")}
                onClick={() => setDonateModal(false)}
              ></Button>
              <Button
                text="Donate"
                classNames={[styles.button, styles.button_primary].join(" ")}
                disabled={!formState.isValid}
                button="submit"
              ></Button>
            </div>
          </form>
        </div>
      </Modal>
    );
  };
  return (
    <>
      {roleNames.SUPER_ADMIN === type && (
        <div className={styles.actions}>
          <Button
            onClick={() => setDonateModal(true)}
            classNames={styles.button_primary}
            text="Donate"
          />
          <DonationModal visible={donateModal} />
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
                label="Tx Hash"
                cellRenderer={renderTxLink}
                dataKey="txn_hash"
                className={styles.ReactVirtualized__Table__rowColumn_ticker}
                width={500}
              />
              <Column
                label="Transaction Date and Time"
                cellRenderer={renderDate}
                dataKey="txn_date"
                className={styles.ReactVirtualized__Table__rowColumn_ticker}
                width={500}
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
        </div>
      )}
      {roleNames.PATIENT === type && (
        <div className={styles.layout}>
          <Card classNames={styles.card__light_orange}>
            <div className={styles.count}>0</div>
            <div className={styles.heading}>Transactions completed</div>
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
  const [{ users }] = useUsersList();
  const [{ transactionLogs }] = useTransactions();

  return (
    <>
      {loginType > 0 && address ? (
        <>
          <Stats type={Number(loginType)} users={users} />
          {loginType !== null && (
            <HandleViews transactions={transactionLogs} type={loginType} />
          )}
        </>
      ) : (
        <DesktopLoader />
      )}
    </>
  );
}

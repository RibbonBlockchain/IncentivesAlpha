import React from "react";
import Card from "../../common/components/Card";
import styles from "./Dashboard.module.scss";

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <div className={styles.layout}>
        <Card classNames={styles.card__light_orange}>
          <div className={styles.count}>0</div>
          <div className={styles.heading}>Patients Registered</div>
        </Card>
        <Card classNames={styles.card__light_blue}>
          <div className={styles.count}>0</div>
          <div className={styles.heading}>Patients Registered</div>
        </Card>
        <Card classNames={styles.card__light_pink}>
          <div className={styles.count}>0</div>
          <div className={styles.heading}>Patients Registered</div>
        </Card>
        <Card classNames={styles.card__light_purple}>
          <div className={styles.count}>0</div>
          <div className={styles.heading}>Patients Registered</div>
        </Card>
      </div>
    </div>
  );
}

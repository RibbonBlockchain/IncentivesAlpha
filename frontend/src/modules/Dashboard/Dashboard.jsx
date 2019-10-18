import React, { useEffect, useState } from "react";
import UserAPI from "../../common/services/api/user.api";
import { roleNames } from "../../common/constants/roles";
import Card from "../../common/components/Card";
import styles from "./Dashboard.module.scss";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  let userAPI = new UserAPI();
  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    let data = await userAPI.listUsers();
    let users = data.data.data;
    setUsers(users);
  }

  function getRoleCount(role) {
    return users
      .map(object => object.role === role)
      .reduce((accumulator, object) => accumulator + object, 0);
  }
  return (
    <div className={styles.dashboard}>
      <div className={styles.layout}>
        <Card classNames={styles.card__light_orange}>
          <div className={styles.count}>{getRoleCount(roleNames.PATIENT)}</div>
          <div className={styles.heading}>Patients Registered</div>
        </Card>
        <Card classNames={styles.card__light_blue}>
          <div className={styles.count}>
            {getRoleCount(roleNames.PRACTITIONER)}
          </div>
          <div className={styles.heading}>Practitioners Registered</div>
        </Card>
        <Card classNames={styles.card__light_pink}>
          <div className={styles.count}>
            {getRoleCount(roleNames.HEALTH_WORKER)}
          </div>
          <div className={styles.heading}>
            Community Health Workers Registered
          </div>
        </Card>
        <Card classNames={styles.card__light_purple}>
          <div className={styles.count}>
            {getRoleCount(roleNames.SUPER_ADMIN)}
          </div>
          <div className={styles.heading}>Administrators</div>
        </Card>
      </div>
    </div>
  );
}

import React from "react";
import { useDispatch } from "react-redux";
import { Link, NavLink, Switch, Route, Redirect } from "react-router-dom";
import Logo from "../../common/components/Logo";
import Balance from "../../common/components/Balance";
import User from "../../common/components/User";
import styles from "./Home.module.scss";
import Footer from "../../common/components/Footer/Footer";
import WalletModal from "../Wallet";

import Dashboard from "../Dashboard/Dashboard";
import CreateInteraction from "../Interactions/Create";
import ListInteractions from "../Interactions/List";

import CreatePractitioner from "../Practitioners/Create";
import ListPractitioners from "../Practitioners/List";

import CreatePatient from "../Patients/Create";
import ListPatients from "../Patients/List";

import CreateHealthWorker from "../HealthWorker/Create";
import ListHealthWorker from "../HealthWorker/List";

import Profile from "../Profile";

import { SHOW_WALLET } from "../../common/constants/wallet";

function Home() {
  const dispatch = useDispatch();

  function showWallet() {
    dispatch({
      type: SHOW_WALLET,
    });
  }
  return (
    <>
      <div className={styles.admin}>
        <header className={styles.admin__header}>
          <Link to="/app/home">
            <Logo logoClass={styles.logo} />
          </Link>
          <div className={styles.toolbar}>
            <div></div>
            <div className={styles.actions}>
              <Balance />
              <User onClick={showWallet} />
            </div>
          </div>
        </header>
        <nav className={styles.admin__nav}>
          <ul className={styles.menu}>
            <li className={styles.menu__item}>
              <NavLink
                activeClassName={styles.active}
                className={styles.menu__link}
                to="/app/home"
              >
                Home
              </NavLink>
            </li>
            <li className={styles.menu__item}>
              <NavLink
                activeClassName={styles.active}
                className={styles.menu__link}
                to="/app/practitioners"
              >
                Practitioners
              </NavLink>
            </li>
            <li className={styles.menu__item}>
              <NavLink
                activeClassName={styles.active}
                className={styles.menu__link}
                to="/app/patients"
              >
                Patients
              </NavLink>
            </li>
            <li className={styles.menu__item}>
              <NavLink
                activeClassName={styles.active}
                className={styles.menu__link}
                to="/app/interactions"
              >
                Interactions
              </NavLink>
            </li>
            <li className={styles.menu__item}>
              <NavLink
                activeClassName={styles.active}
                className={styles.menu__link}
                to="/app/health-workers"
              >
                Health Workers
              </NavLink>
            </li>
            <li className={styles.menu__item}>
              <NavLink
                activeClassName={styles.active}
                className={styles.menu__link}
                to="/app/profile"
              >
                My Profile
              </NavLink>
            </li>
          </ul>
        </nav>
        <main className={styles.admin__main}>
          <Switch>
            <Route path="/app/home" component={Dashboard} />
            <Route path="/app/interactions" component={ListInteractions} />
            <Route path="/app/interactions/new" component={CreateInteraction} />
            <Route path="/app/practitioners" component={ListPractitioners} />
            <Route
              path="/app/practitioners/new"
              component={CreatePractitioner}
            />
            <Route path="/app/patients" component={ListPatients} />
            <Route path="/app/patients/new" component={CreatePatient} />

            <Route path="/app/health-workers" component={ListHealthWorker} />
            <Route
              path="/app/health-workers/new"
              component={CreateHealthWorker}
            />
            <Route path="/app/profile" component={Profile} />
            <Redirect from="*" to="/app/home" />
          </Switch>
          <WalletModal />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Home;

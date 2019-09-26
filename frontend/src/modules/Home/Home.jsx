import React from "react";
import { Link, Switch, Route } from "react-router-dom";
import Logo from "../../common/components/Logo";
import User from "../../common/components/User";
import styles from "./Home.module.scss";
import Dashboard from "../Dashboard/Dashboard";
import Footer from "../../common/components/Footer/Footer";

function Home() {
  return (
    <>
      <div className={styles.admin}>
        <header className={styles.admin__header}>
          <Link to="/">
            <Logo logoClass={styles.logo} />
          </Link>
          <div className={styles.toolbar}>
            <div></div>
            <User />
          </div>
        </header>
        <nav className={styles.admin__nav}>
          <ul className={styles.menu}>
            <li className={styles.menu__item}>
              <Link className={styles.menu__link} to="/">
                Home
              </Link>
            </li>
          </ul>
          <div className={[styles.menu_logout].join(" ")}>
            <button className={[styles.btn, styles.btn_primary].join(" ")}>
              Logout
            </button>
          </div>
        </nav>
        <main className={styles.admin__main}>
          <Switch>
            <Route path="/" component={Dashboard} />
          </Switch>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Home;

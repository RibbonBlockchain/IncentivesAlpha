import React from "react";
import { useDispatch } from "react-redux";
import Web3Connect from "web3connect";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Portis from "@portis/web3";
import Fortmatic from "fortmatic";
import { APP_INITIALIZED } from "../../common/constants/web3";
import Logo from "../../common/components/Logo";
import { Link } from "react-router-dom";

import styles from "./Login.module.scss";
import { SHOW_ALERT } from "../../common/constants/alert";

function Login({ history }) {
  const dispatch = useDispatch();
  return (
    <>
      <div className={styles.container}>
        <div className={styles.login_bg}></div>
        <div className={styles.login_box}>
          <div className={styles.form}>
            <div className={styles.login_box}>
              <Web3Connect.Button
                network={process.env.REACT_APP_NETWORK}
                providerOptions={{
                  walletconnect: {
                    package: WalletConnectProvider,
                    options: {
                      infuraId: process.env.REACT_APP_INFURA_ID
                    }
                  },
                  portis: {
                    package: Portis,
                    options: {
                      id: process.env.REACT_APP_PORTIS_ID
                    }
                  },
                  fortmatic: {
                    package: Fortmatic,
                    options: {
                      key: process.env.REACT_APP_FORTMATIC_ID
                    }
                  }
                }}
                onConnect={provider => {
                  dispatch({
                    type: APP_INITIALIZED,
                    payload: new Web3(provider)
                  });
                  history.push("/dashboard");
                }}
                onClose={() => {
                  dispatch({
                    type: SHOW_ALERT,
                    payload: "Action was terminated by user"
                  });
                }}
              />
            </div>
            <div className={styles.headline}>
              <small>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit
              </small>
            </div>
            <Link to="/app">Dashboard</Link>
          </div>
          <div className={styles.logo}>
            <Logo />
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

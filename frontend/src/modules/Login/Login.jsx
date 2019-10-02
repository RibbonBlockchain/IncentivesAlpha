import React from "react";
import { useDispatch } from "react-redux";
import Web3Connect from "web3connect";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Portis from "@portis/web3";
import Fortmatic from "fortmatic";

import { config } from "../../common/constants/config";
import { authenticateUser } from "../../common/utils/web3/auth";

import Logo from "../../common/components/Logo";
import styles from "./Login.module.scss";
import { SHOW_ALERT } from "../../common/constants/alert";

function Login({ history }) {
  let { WALLET_CONNECT, PORTIS, FORTMATIC, NETWORK } = config;

  function processLogin(provider) {
    authenticateUser(provider)
      .then(response => {
        if (response.type === "success") {
          history.push("/app");
        } else {
          dispatch({
            type: SHOW_ALERT,
            payload: response.msg.toString()
          });
        }
      })
      .catch(err =>
        dispatch({
          type: SHOW_ALERT,
          payload: err.toString()
        })
      );
  }
  const dispatch = useDispatch();
  return (
    <>
      <div className={styles.container}>
        <div className={styles.login_bg}></div>
        <div className={styles.login_box}>
          <div className={styles.form}>
            <div className={styles.login_box}>
              <Web3Connect.Button
                network={NETWORK}
                providerOptions={{
                  walletconnect: {
                    package: WalletConnectProvider,
                    options: {
                      infuraId: WALLET_CONNECT
                    }
                  },
                  portis: {
                    package: Portis,
                    options: {
                      id: PORTIS
                    }
                  },
                  fortmatic: {
                    package: Fortmatic,
                    options: {
                      key: FORTMATIC
                    }
                  }
                }}
                onConnect={provider => processLogin(provider)}
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

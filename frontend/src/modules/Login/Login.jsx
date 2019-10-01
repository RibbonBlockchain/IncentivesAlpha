import React from "react";
import { useDispatch } from "react-redux";
import Web3Connect from "web3connect";
import { Link } from "react-router-dom";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Portis from "@portis/web3";
import Fortmatic from "fortmatic";

import { config } from "../../common/constants/config";
import { signMessage, login } from "../../common/utils/web3/auth";

import Logo from "../../common/components/Logo";
import styles from "./Login.module.scss";
import { SHOW_ALERT } from "../../common/constants/alert";

function Login({ history }) {
  let { WALLET_CONNECT, PORTIS, FORTMATIC, NETWORK } = config;

  
  function processLogin(provider) {
    signMessage(provider)
      .then(response => {
        console.log(response);
        if (response.type === "success") {
          // call api
          login()
            .then(result => {
				// validate the user address exists
              // redirect to dashboard if successful
              history.push("/app/dashboard");
            })
            .catch(err => {
              dispatch({
                type: SHOW_ALERT,
                payload: response.msg.toString()
              });
            });
        } else {
          dispatch({
            type: SHOW_ALERT,
            payload: response.msg.toString()
          });
        }
      })
      .catch(err => console.log("Errror", err));
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
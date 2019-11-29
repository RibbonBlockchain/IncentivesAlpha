import React, { useState } from "react";
import Web3Connect from "web3connect";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Portis from "@portis/web3";
import Fortmatic from "fortmatic";
import { config } from "../../common/constants/config";
import Logo from "../../common/components/Logo";
import styles from "./Login.module.scss";
import { authenticateUser } from "./login.utils";
import { TableLoader } from "../../common/components/Loader";
import { useWeb3 } from "../../common/providers/Web3.provider";
import { useModal, useAlert } from "../../common/providers/Modal.provider";
import { clear } from "../../common/utils/storage";

function Login() {
  const [, login] = useWeb3();
  const [, toggle] = useAlert();
  const [, toggleModal] = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const loginUser = async provider => {
    setIsLoading(true);
    let result = await authenticateUser(provider);
    console.log(result);
    let { authWithAPI, publicAddress, loginType } = result;
    if (result.error) {
      setIsLoading(false);
      if (result.error.code === -32603) {
        toggle({
          isVisible: true,
          message: result.error.message || result.error.stack.split(".")[0].split(":")[2]
        });
      } else if (result.error === "SIG_FAIL_ERR") {
        toggle({
          isVisible: true,
          message: "Signature verification failed. Please try again"
        });
      } else if (result.error === "USER_NOT_FOUND_ERR") {
        toggleModal({
          isVisible: true,
          data: {
            details: {
              publicAddress,
              type: "onboard"
            },
            message: "Share this QR Code with the Community Health Worker"
          },
          modal: "qr"
        });
      } else {
        toggle({
          isVisible: true,
          message: result.error.message ? result.error.message : result.error
        });
      }
    } else {
      if (
        authWithAPI.token !== null ||
        typeof authWithAPI.token !== "undefined"
      ) {
        setIsLoading(false);
        login({ token: authWithAPI.token, address: publicAddress, loginType });
      } else {
        toggle({
          isVisible: true,
          message: "Internal Server error."
        });
        clear("token");
        clear("address");
      }
    }
  };

  let { WALLET_CONNECT, PORTIS, FORTMATIC } = config;
  return (
    <>
      {isLoading && <TableLoader />}
      <div className={styles.container}>
        <div className={styles.login_bg}></div>
        <div className={styles.login_box}>
          <div className={styles.form}>
            <div className={styles.headline}>
              <h3>Ribbon Incentives Ecosystem</h3>
            </div>
            <div className={styles.login_box}>
              <Web3Connect.Button
                network="mainnet"
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
                onConnect={provider => loginUser(provider)}
                onClose={() =>
                  toggle({
                    isVisible: true,
                    message: "Action was terminated by user"
                  })
                }
              />
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

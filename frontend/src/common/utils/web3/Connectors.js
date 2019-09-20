import Web3Connect from "web3connect";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Portis from "@portis/web3";
import Fortmatic from "fortmatic";

const web3Connect = new Web3Connect.Core({
  network: process.env.REACT_APP_NETWORK,
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: "INFURA_ID"
      }
    },
    portis: {
      package: Portis,
      options: {
        id: "PORTIS_ID"
      }
    },
    fortmatic: {
      package: Fortmatic,
      options: {
        key: "FORTMATIC_KEY"
      }
    }
  }
});

export default web3Connect;

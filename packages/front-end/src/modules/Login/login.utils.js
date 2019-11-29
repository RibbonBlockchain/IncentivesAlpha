import { ethers } from "ethers";
import Web3 from "web3";
import WalletConnect from "@walletconnect/browser";
import { convertUtf8ToHex } from "@walletconnect/utils";
import Portis from "@portis/web3";
import EthSigUtil from "eth-sig-util";
import IRegistry from "../../common/services/blockchain/apps/registry";
import AuthAPI from "../../common/services/api/auth.api";
import { setItem, clear } from "../../common/utils/storage";
import { config } from "../../common/constants/config";

export async function authenticateUser(provider) {
  try {
    let nonce = `Signing into RibbonBlockchain Dapp`;
    if (provider.isWalletConnect) {
      const walletConnector = new WalletConnect({
        bridge: "https://bridge.walletconnect.org"
      });

      const accounts = await walletConnector.accounts;
      const messageParams = [convertUtf8ToHex(nonce), accounts[0]];
      let signature = await walletConnector.signPersonalMessage(messageParams);
      let recoveredAddress = await ethers.utils.verifyMessage(nonce, signature);
      if (recoveredAddress !== accounts[0]) {
        return {
          error: `Address recovered do not match, original ${accounts[0]} versus computed ${recoveredAddress}`
        };
      }
      return await loginUser(signature, accounts[0]);
    } else if (provider.isPortis) {
      let portis = new Portis(config.PORTIS, "sokol");
      let web3 = new Web3(portis.provider);
      const accounts = await web3.eth.getAccounts();
      const messageHex = "0x" + new Buffer(nonce, "utf8").toString("hex");
      const signedMessage = await web3.currentProvider.send("personal_sign", [
        messageHex,
        accounts[0]
      ]);

      const recovered = EthSigUtil.recoverPersonalSignature({
        data: messageHex,
        sig: signedMessage
      });
      if (recovered.toLowerCase() !== accounts[0].toLowerCase()) {
        return {
          error: `Address recovered do not match, original ${accounts[0]} versus computed ${recovered}`
        };
      }

      return await loginUser(signedMessage, accounts[0]);
    } else {
      let providerEngine = new ethers.providers.Web3Provider(provider);
      let signer = providerEngine.getSigner();
      let signature = await signer.signMessage(nonce);
      let publicAddress = await signer.getAddress();
      let recoveredAddress = await ethers.utils.verifyMessage(nonce, signature);
      if (recoveredAddress !== publicAddress) {
        return {
          error: `Address recovered do not match, original ${publicAddress} versus computed ${recoveredAddress}`
        };
      }
      return await loginUser(signature, publicAddress);
    }
  } catch (error) {
    return {
      error
    };
  }
}

const loginUser = async (signature, publicAddress) => {
  let contract = new IRegistry();
  let authAPI = new AuthAPI();
  try {
    let authWithAPI = await authAPI.authenticate({
      publicAddress,
      signature
    });
    if (authWithAPI.error) {
      return {
        error: authWithAPI.error,
        publicAddress
      };
    } else if (authWithAPI.token) {
      let loginType = await contract.getUserRole(publicAddress);
      if (loginType) {
        return {
          authWithAPI,
          publicAddress,
          loginType
        };
      } else {
        return {
          error: "Failed to retrieve user login role"
        };
      }
    } else {
      clear();
      return {
        error:
          "Looks like connection to server timed out. Please try again later"
      };
    }
  } catch (error) {
    return {
      error
    };
  }
};

export async function approveUser(user) {
  setItem("token", user.authWithAPI.token);
  setItem("address", user.publicAddress);
  setItem("loginType", user.loginType);
  //   todo replace this
  window.location.reload();
}

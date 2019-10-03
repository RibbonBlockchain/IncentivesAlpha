import IRegistry from "../../common/services/blockchain/apps/registry";
import AuthAPI from "../../common/services/api/auth.api";
import { setItem } from "../../common/utils/storage";

export async function authenticateUser() {
  let contract = new IRegistry();
  let authAPI = new AuthAPI();

  let { ethers, signer } = await contract.getInstance();

  try {
    let nonce = `Signing into RibbonBlockchain Dapp`;
    let signature = await signer.signMessage(nonce);
    let publicAddress = await signer.getAddress();
    let recoveredAddress = await ethers.utils.verifyMessage(nonce, signature);
    if (recoveredAddress != publicAddress) {
      return {
        authWithAPI: {
          error: `Address recovered do not match, original ${publicAddress} versus computed ${recoveredAddress}`
        }
      };
    }

    try {
      let userRole = await contract.getUserRole(publicAddress);
      let authWithAPI = await authAPI.authenticate({
        publicAddress,
        signature
      });
      return {
        authWithAPI,
        publicAddress,
        loginType: userRole.value.toString()
      };
    } catch (error) {
      return {
        authWithAPI: {
          error
        }
      };
    }
  } catch (error) {
    return {
      authWithAPI: {
        error
      }
    };
  }
}

export async function approveUser(user, history) {
  setItem("token", user.authWithAPI.token);
  setItem("address", user.publicAddress);
  setItem("loginType", user.loginType);
  //   todo replace this
  window.location.reload();
}

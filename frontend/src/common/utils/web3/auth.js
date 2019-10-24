import IRegistry from "../../services/blockchain/apps/registry";
import AuthAPI from "../../services/api/auth.api";
import { setItem } from "../../utils/storage";

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

    let userRole = await contract.getUserRole(publicAddress);
    let authWithAPI = await authAPI.authenticate({
      publicAddress,
      signature
    });
    return {
      authWithAPI,
      userRole
    };
  } catch (error) {
    return {
      authWithAPI: {
        error
      }
    };
  }
}

export async function approveUser(user) {
  setItem("token", user.authWithAPI.token);
  setItem("address", user.publicAddress);
  setItem("loginType", user.userRole.value.toString());
  //   todo replace this
  //   window.location.reload();
}

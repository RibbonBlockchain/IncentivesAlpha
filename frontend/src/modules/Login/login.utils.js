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
    if (recoveredAddress !== publicAddress) {
      return {
        error: `Address recovered do not match, original ${publicAddress} versus computed ${recoveredAddress}`
      };
    }

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
      } else {
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
      }
    } catch (error) {
      return {
        error
      };
    }
  } catch (error) {
    return {
      error
    };
  }
}

export async function approveUser(user) {
  setItem("token", user.authWithAPI.data.token);
  setItem("address", user.publicAddress);
  setItem("loginType", user.loginType);
  //   todo replace this
  window.location.reload();
}

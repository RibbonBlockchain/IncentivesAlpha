import { ethers } from "ethers";
import IRegistry from "../../common/services/blockchain/apps/registry";
import AuthAPI from "../../common/services/api/auth.api";
import { setItem, clear } from "../../common/utils/storage";

export async function authenticateUser(provider) {
  let contract = new IRegistry();
  let authAPI = new AuthAPI();

  let providerEngine = new ethers.providers.Web3Provider(provider);

  let signer = providerEngine.getSigner();

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
  } catch (error) {
    console.log(error);
    return {
      error
    };
  }
}

export async function approveUser(user) {
  setItem("token", user.authWithAPI.token);
  setItem("address", user.publicAddress);
  setItem("loginType", user.loginType);
  //   todo replace this
  window.location.reload();
}

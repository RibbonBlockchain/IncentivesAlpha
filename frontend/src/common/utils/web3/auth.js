import IRegistry from "../../services/blockchain/apps/registry";
import AuthAPI from "../../services/api/auth.api";

export async function authenticateUser(provider) {
  let contract = new IRegistry(provider);
  let authAPI = new AuthAPI();

  return await contract
    .getInstance(provider)
    .then(async result => {
      let { ethers, signer } = result;
      let nonce = `I am signing my one-time nonce ${Math.floor(
        Math.random() * 10000
      )}`;
      let sig = await signer.signMessage(nonce);
      let ethAddress = await signer.getAddress();
      // let hash = await ethers.utils.keccak256(ethAddress);

      let recover = ethers.utils.verifyMessage(nonce, sig);
      if (recover != ethAddress) {
        return {
          msg: `Address recovered do not match, original ${ethAddress} versus computed ${recover}`,
          type: "error"
        };
      }
      return authAPI
        .authenticate({
          publicAddress: ethAddress,
          signature: sig
        })
        .then(auth => {
          console.log("Auth ", auth);
          return auth;
        })
        .catch(err => {
          console.log("Error ", err);
          return err;
        });
    })
    .catch(err => {
      return {
        msg: err,
        type: "error"
      };
    });
}

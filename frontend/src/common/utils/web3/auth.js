import IRegistry from "../../services/blockchain/apps/registry";

export async function signMessage(provider) {
  let contract = new IRegistry(provider);

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
      return {
        msg: ethAddress,
        type: "success"
      };
    })
    .catch(err => {
      return {
        msg: err,
        type: "error"
      };
    });
}

export async function login() {
  // process api authentication here
  return true;
}

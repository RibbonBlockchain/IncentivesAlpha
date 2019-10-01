import { ethers } from "ethers";
import { config } from "../../constants/config";

const { POA_RPC, PRIVATE_KEY } = config;

const init = function(provider) {
  let providerEngine =
    typeof provider != "undefined"
      ? new ethers.providers.Web3Provider(provider)
      : new ethers.providers.JsonRpcProvider({
          url: POA_RPC
        });

  let signer = providerEngine.getSigner();
  let wallet = new ethers.Wallet(PRIVATE_KEY, providerEngine);

  return {
    provider: providerEngine,
    signer,
    wallet,
    ethers
  };
};

export default class BlockchainService {
  constructor() {
    this.getInstance();
  }

  async getInstance(provider) {
    return new Promise(async (resolve, reject) => {
      try {
        const initializeApps = await init(provider);
        resolve(initializeApps);
      } catch (err) {
        reject(err);
      }
    });
  }

  async initializeContract(address, contractABI, provider) {
    return this.getInstance(provider)
      .then(async result => {
        return await new result.ethers.Contract(
          address,
          contractABI.abi,
          result.provider
        );
      })
      .catch(err => {
        return err;
      });
  }
}

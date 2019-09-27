import { ethers } from "ethers";
import { config } from "../../constants/config";

const { POA_RPC, PRIVATE_KEY } = config;

const init = function() {
  let provider = new ethers.providers.JsonRpcProvider({
    url: POA_RPC
  });
  let signer = provider.getSigner(0);
  let wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  return {
    provider,
    signer,
    wallet,
    ethers
  };
};

export default class BlockchainService {
  constructor() {
    this.getInstance();
  }

  getInstance = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const initializeApps = await init();
        resolve(initializeApps);
      } catch (err) {
        reject(err);
      }
    });
  };

  async initializeContract(address, contractABI) {
    return this.getInstance().then(async result => {
      return await new result.ethers.Contract(
        address,
        contractABI.abi,
        result.provider
      );
    });
  }
}

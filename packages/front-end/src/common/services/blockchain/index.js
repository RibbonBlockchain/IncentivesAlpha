import { ethers } from "ethers";
import { config } from "../../constants/config";

const { POA_RPC } = config;

const init = async function() {
  let provider = window && window.web3 && window.web3.currentProvider;
  let providerEngine =
    typeof provider != "undefined" && provider.hasOwnProperty("selectedAddress")
      ? new ethers.providers.Web3Provider(provider)
      : new ethers.providers.JsonRpcProvider({
          url: POA_RPC
        });

  let signer = await providerEngine.getSigner();

  return {
    provider: providerEngine,
    signer,
    ethers
  };
};

export default class BlockchainService {
  constructor() {
    this.getInstance();
  }

  async getInstance() {
    return new Promise(async (resolve, reject) => {
      try {
        const initializeApps = await init();
        resolve(initializeApps);
      } catch (err) {
        reject(err);
      }
    });
  }

  async initializeContract(address, contract) {
    try {
      let instance = await this.getInstance();
      return await new instance.ethers.Contract(
        address,
        contract.abi,
        instance.signer
      );
    } catch (error) {
      return error;
    }
  }

  async sendTokens({ amount, receipient, message }) {
    try {
      let { signer, ethers } = await this.getInstance();
      const transaction = {
        to: receipient,
        nonce: 0,
        value: ethers.utils.parseEther(amount),
        chainId: ethers.utils.getNetwork("homestead").chainId
      };
      return await signer.sendTransaction(transaction);
    } catch (error) {
      return error.message;
    }
  }
}

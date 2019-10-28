import { ethers } from "ethers";
import { config } from "../../constants/config";

const { POA_RPC, PRIVATE_KEY } = config;

const init = async function() {
  let provider = window.web3.currentProvider;
  let providerEngine =
    typeof provider != "undefined" && provider.hasOwnProperty("selectedAddress")
      ? new ethers.providers.Web3Provider(provider)
      : new ethers.providers.JsonRpcProvider({
          url: POA_RPC
        });

  let signer = await providerEngine.getSigner();
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

  async initializeContract(address, contractABI) {
    try {
      let instance = await this.getInstance();
      return await new instance.ethers.Contract(
        address,
        contractABI.abi,
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
        // gasLimit: 0,
        // gasPrice: 0,
        // data: `0x${ethers.utils.hexlify(message)}`,
        value: ethers.utils.parseEther(amount),
        chainId: ethers.utils.getNetwork("homestead").chainId
      };
      return await signer.sendTransaction(transaction);
    } catch (error) {
      return error.message;
    }
  }
}

import BlockchainService from "../index";
import Vault from "../abis/Vault.json";

import { config } from "../../../constants/config";
import { waitForConfirmation } from "../utils";

let vaultAddress = config.VAULT_CONTRACT_ADDRESS;

export default class VaultContract extends BlockchainService {
  constructor() {
    super();
    this.blockchainService = new BlockchainService();
    this.contract = this.initializeContract(vaultAddress, Vault);
  }

  async address() {}

  async donateFunds(value, message) {
    let { ethers, provider } = await this.getInstance();
    let contract = await this.contract;
    try {
      let tx = await contract.donateFunds(message, {
        value: ethers.utils.parseEther(value.toString())
      });
      return await waitForConfirmation(provider, tx);
    } catch (error) {
      return error;
    }
  }

  async init() {}

  async kill() {}

  async payout({ patient, practitioner, chw, amount }) {
    let { provider } = await this.getInstance();
    let contract = await this.contract;
    try {
      let tx = await contract.payout(patient, practitioner, chw, amount);
      return await waitForConfirmation(provider, tx);
    } catch (error) {
      return error;
    }
  }
}

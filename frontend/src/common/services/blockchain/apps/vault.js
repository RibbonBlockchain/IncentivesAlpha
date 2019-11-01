import BlockchainService from "../index";
import Vault from "../abis/Vault.json";

import { config } from "../../../constants/config";

let vaultAddress = config.VAULT_CONTRACT_ADDRESS;

export default class VaultContract extends BlockchainService {
  constructor() {
    super();
    this.blockchainService = new BlockchainService();
    this.contract = this.initializeContract(vaultAddress, Vault);
  }

  async address() {}

  async donateFunds(value, message) {
    let { ethers } = await this.getInstance();
    let contract = await this.contract;
    try {
      return await contract.donateFunds(message, {
        value: ethers.utils.parseEther(value.toString())
      });
    } catch (error) {
      return error;
    }
  }

  async init() {}

  async kill() {}

  async payout({ patient, practitioner, chw, amount }) {
    let { ethers, signer } = await this.getInstance();
    let contract = await this.contract;
    try {
      let patientAmountInEthers = ethers.utils.parseEther(amount.toString());
      let practitionerAmountInEthers = ethers.utils.parseEther(
        amount.toString()
      );
      let chwAmountInEthers = ethers.utils.parseEther(amount.toString());

      let contractFunction = contract.payout(
        patient,
        practitioner,
        chw,
        patientAmountInEthers,
        practitionerAmountInEthers,
        chwAmountInEthers
      );

      let tx = {
        data: contractFunction.data
      };

      return await signer.sendTransaction(tx);
    } catch (error) {
      return error;
    }
  }
}

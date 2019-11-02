import BlockchainService from "../index";
import Vault from "../abis/Vault.json";
import * as unit from "ethjs-unit";
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
        value: ethers.utils.parseUnits(value.toString(), 18)
      });
    } catch (error) {
      return error;
    }
  }

  async init() {}

  async kill() {}

  async payout({
    patient,
    practitioner,
    chw,
    patientAmount,
    practitionerAmount,
    chwAmount
  }) {
    try {
      let { ethers } = await this.getInstance();
      let contract = await this.contract;
      console.log(patientAmount, practitionerAmount, chwAmount);
      let patAmount = ethers.utils.parseUnits(patientAmount.toString(), 18);
      let practAmount = ethers.utils.parseUnits(
        practitionerAmount.toString(),
        18
      );
      let chAmount = ethers.utils.parseUnits(chwAmount.toString(), 18);
      console.log(patAmount, practAmount, chAmount);
      return await contract.payout(
        patient,
        practitioner,
        chw,
        patAmount,
        practAmount,
        chAmount
      );
    } catch (error) {
      return error;
    }
  }
}

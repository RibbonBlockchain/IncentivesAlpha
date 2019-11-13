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
      let { ethers, provider } = await this.getInstance();
      let contract = await this.contract;
      console.log(patientAmount, practitionerAmount, chwAmount);
      let patientAmountToBeSent = (patientAmount * 10 ** 18).toString();
      let practitionerAmountToBeSent = (
        practitionerAmount *
        10 ** 18
      ).toString();
      let chwAmountToBeSent = (chwAmount * 10 ** 18).toString();
      console.log(
        patientAmountToBeSent,
        practitionerAmountToBeSent,
        chwAmountToBeSent
      );
      let totalAmountToBeTransfered =
        patientAmount + practitionerAmount + chwAmount;
      let currentVaultBalance = await provider.getBalance(
        config.VAULT_CONTRACT_ADDRESS
      );
      let balance = currentVaultBalance.toString();

      if (totalAmountToBeTransfered <= balance) {
        return await contract.payout(
          patient,
          practitioner,
          chw,
          patientAmountToBeSent,
          practitionerAmountToBeSent,
          chwAmountToBeSent
        );
      } else {
        return "Insufficient balance on vault";
      }
    } catch (error) {
      console.log(error);
      return "An error occured. Please try again";
    }
  }
}

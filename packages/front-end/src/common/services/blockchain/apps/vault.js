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
      let { provider } = await this.getInstance();
      let contract = await this.contract;
      console.log(patientAmount, practitionerAmount, chwAmount);
      let patientAmountToBeSent = Math.ceil(
        patientAmount * 10 ** 18
      ).toString();
      let practitionerAmountToBeSent = Math.ceil(
        practitionerAmount * 10 ** 18
      ).toString();
      let chwAmountToBeSent = Math.ceil(chwAmount * 10 ** 18).toString();
      console.log(patient, practitioner, chw);
      console.log(
        patientAmountToBeSent,
        practitionerAmountToBeSent,
        chwAmountToBeSent
      );
      let totalAmountToBeTransfered =
        (patientAmount + practitionerAmount + chwAmount) * 10 ** 18;
      let currentVaultBalance = await provider.getBalance(
        config.VAULT_CONTRACT_ADDRESS
      );

      if (
        totalAmountToBeTransfered <= parseFloat(currentVaultBalance.toString())
      ) {
        return await contract.payout(
          patient,
          practitioner,
          chw,
          patientAmountToBeSent,
          practitionerAmountToBeSent,
          chwAmountToBeSent
        );
      } else {
        console.log("BALANCE ERROR");
        return "Insufficient balance on vault";
      }
    } catch (error) {
      console.log(error);
      return "An error occured. Please try again";
    }
  }
}

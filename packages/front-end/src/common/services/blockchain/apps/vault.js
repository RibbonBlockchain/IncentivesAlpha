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
      let patientAmountToBeSent = ethers.utils.parseUnits(
        patientAmount.toString(),
        18
      );
      let practitionerAmountToBeSent = ethers.utils.parseUnits(
        practitionerAmount.toString(),
        18
      );
      let chwAmountToBeSent = ethers.utils.parseUnits(chwAmount.toString(), 18);
      console.log(
        patientAmountToBeSent,
        practitionerAmountToBeSent,
        chwAmountToBeSent
      );
      let totalAmountToBeTransfered =
        patientAmountToBeSent + practitionerAmountToBeSent + chwAmount;
      let currentVaultBalance = await provider.getBalance(
        config.VAULT_CONTRACT_ADDRESS
      );
      //   console.log(
      //     ethers.utils.formatEther(currentVaultBalance.toString()),
      //     ethers.utils.formatEther(totalAmountToBeTransfered)
      //   );
      //   if (currentVaultBalance <= totalAmountToBeTransfered) {
      return await contract.payout(
        patient,
        practitioner,
        chw,
        patientAmountToBeSent,
        practitionerAmountToBeSent,
        chwAmountToBeSent
      );
      //   } else {
      //     return "Insufficient balance on vault";
      //   }
    } catch (error) {
      return error;
    }
  }
}

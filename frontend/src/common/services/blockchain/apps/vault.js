import BlockchainService from "../blockchain";
import IVault from "../abis/IVault.json";

import { config } from "../../../constants/config";
import { toHex } from "../../../utils";

let vaultAddress = config.VAULT_CONTRACT_ADDRESS;

export default class VaultContract extends BlockchainService {
  constructor() {
    super();
    this.blockchainService = new BlockchainService();
    this.contract = this.initializeContract(vaultAddress, IVault);
  }

  static async address() {}

  static async donateFunds() {}

  static async init() {}

  static async kill() {}

  static async payout() {}
}

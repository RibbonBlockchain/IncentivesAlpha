import BlockchainService from "../index";
import IAdmin from "../abis/IAdmin.json";

import { config } from "../../../constants/config";

let adminAddress = config.ADMIN_CONTRACT_ADDRESS;

export default class AdminContract extends BlockchainService {
  constructor() {
    super();
    // this.blockchainService = new BlockchainService();
    this.contract = this.initializeContract(adminAddress, IAdmin);
    this.addUser = this.addUser.bind(this);
    this.address = this.address.bind(this);
    this.donateFunds = this.donateFunds.bind(this);
    this.removeUser = this.removeUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  async addUser(address, role) {
    return await this.contract.then(contract =>
      contract.addUser(address, role)
    );
  }

  async address() {
    return await this.contract.then(contract => contract.address);
  }

  async donateFunds() {}

  async removeUser(address) {
    return await this.contract.then(contract => contract.removeUser(address));
  }

  async updateUser(address) {
    return await this.contract.then(contract => contract.updateUser(address));
  }
}

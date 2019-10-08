import BlockchainService from "../index";
import Admin from "../abis/Admin.json";

import { config } from "../../../constants/config";

let adminAddress = config.ADMIN_CONTRACT_ADDRESS;

export default class AdminContract extends BlockchainService {
  constructor() {
    super();
    this.contract = this.initializeContract(adminAddress, Admin);
    this.addUser = this.addUser.bind(this);
    this.address = this.address.bind(this);
    this.donateFunds = this.donateFunds.bind(this);
    this.removeUser = this.removeUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  async addUser(address, role) {
    let { ethers } = await this.getInstance();
    let contract = await this.contract;
    try {
      return await contract.addUser(address, role);
    } catch (error) {
      return error;
    }
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

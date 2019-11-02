import BlockchainService from "../index";
import Admin from "../abis/Admin.json";

import { config } from "../../../constants/config";
import { waitForConfirmation } from "../utils";

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
    let { provider } = await this.getInstance();
    let contract = await this.contract;
    try {
      return await contract.addUser(address, role);
    } catch (error) {
      return error;
    }
  }

  async address() {
    let contract = await this.contract;
    try {
      return await contract.address;
    } catch (error) {
      return error;
    }
  }

  async donateFunds() {}

  async removeUser(address) {
    let contract = await this.contract;
    try {
      return await contract.removeUser(address);
    } catch (error) {
      return error;
    }
  }

  async updateUser(address) {
    let contract = await this.contract;
    try {
      return await contract.updateUser(address);
    } catch (error) {
      return error;
    }
  }
}

import BlockchainService from "../index";
import Registry from "../abis/Registry.json";
import { config } from "../../../constants/config";
import { waitForConfirmation } from "../utils";

let registryAddress = config.REGISTRY_CONTRACT_ADDRESS;

export default class RegistryContract extends BlockchainService {
  constructor() {
    super();
    this.contract = this.initializeContract(registryAddress, Registry);
    this.addUser = this.addUser.bind(this);
    this.address = this.address.bind(this);
    this.balanceOf = this.balanceOf.bind(this);
    this.getUserRole = this.getUserRole.bind(this);
    this.recordPayout = this.recordPayout.bind(this);
    this.removeUser = this.removeUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.addWhitelistAdmin = this.addWhitelistAdmin.bind(this);
  }

  async addWhitelistAdmin(address) {
    let { provider } = await this.getInstance();
    let contract = await this.contract;
    try {
      let tx = await contract.addWhitelistAdmin(address);
      return await waitForConfirmation(provider, tx);
    } catch (error) {
      return error;
    }
  }
  async addUser(address, role) {
    let { ethers, provider } = await this.getInstance();
    let contract = await this.contract;
    try {
      let tx = await contract.addUser(address, role, {
        gasLimit: ethers.utils.hexlify(80000)
      });
      return await waitForConfirmation(provider, tx);
    } catch (error) {
      return error;
    }
  }
  async address() {}
  async balanceOf() {}
  async getUserRole(address) {
    let contract = await this.contract;
    try {
      return await contract.getUserRole(address);
    } catch (error) {
      return error;
    }
  }
  async recordPayout() {}
  async removeUser() {}
  async updateUser() {}
}

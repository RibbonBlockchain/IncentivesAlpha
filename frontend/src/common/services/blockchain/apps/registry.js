import BlockchainService from "../index";
import IRegistry from "../abis/IRegistry.json";
import { config } from "../../../constants/config";

let registryAddress = config.REGISTRY_CONTRACT_ADDRESS;

export default class RegistryContract extends BlockchainService {
  constructor() {
    super();
    this.blockchainService = new BlockchainService();
    this.contract = this.initializeContract(registryAddress, IRegistry);
    this.addUser = this.addUser.bind(this);
    this.address = this.address.bind(this);
    this.balanceOf = this.balanceOf.bind(this);
    this.getUserRole = this.getUserRole.bind(this);
    this.recordPayout = this.recordPayout.bind(this);
    this.removeUser = this.removeUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  async addUser() {}
  async address() {}
  async balanceOf() {}
  async getUserRole(address) {
    return await this.contract.then(async contract => {
      return await contract.getUserRole(address);
    });
  }
  async recordPayout() {}
  async removeUser() {}
  async updateUser() {}
}

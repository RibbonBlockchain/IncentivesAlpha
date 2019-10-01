import HTTP from "./http";

export default class SuperAdmin extends HTTP {
  constructor() {
    super();
  }

  async listUsers() {
    return await this.getRequest("users");
  }

  async createUser(data) {
    return await this.postRequest("users", data);
  }

  async getUserByAddress(address) {
    return await this.getRequest(`users/${address.toLowerCase()}`);
  }

  async listUsersByRole(role) {
    return await this.getRequest(`users/${role.toLowerCase()}`);
  }

  async updateUser(data) {
    return await this.patchRequest(`users/${data.address.toLowerCase()}`, data);
  }

  async deactivateUser() {}
}

import HTTP from "./http";

export default class SuperAdmin extends HTTP {
  constructor() {
    super();
  }

  async listUsers() {
    return await this.getRequest("users")
      .then(result => {
        return result;
      })
      .catch(error => {
        return error;
      });
  }

  async createUser(data) {
    return await this.postRequest("users", data)
      .then(result => {
        return result;
      })
      .catch(error => {
        return error;
      });
  }

  async getUserByAddress(address) {
    return await this.getRequest(`users/${address.toLowerCase()}`)
      .then(result => {
        return result;
      })
      .catch(error => {
        return error;
      });
  }

  async listUsersByRole(role) {
    return await this.getRequest(`users/${role.toLowerCase()}`)
      .then(result => {
        return result;
      })
      .catch(error => {
        return error;
      });
  }

  async updateUser(data) {
    return await this.patchRequest(`users/${data.address.toLowerCase()}`, data)
      .then(result => {
        return result;
      })
      .catch(error => {
        return error;
      });
  }

  async deactivateUser() {}
}

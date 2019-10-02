/**
 * @file Manages RibbonBlockchain User requests
 * @author RibbonBlockchain engineers
 */
import HTTP from "./http";

export default class SuperAdmin extends HTTP {
  constructor() {
    super();
  }

  /**
   * List Users Request
   *
   * @async
   * @method listUsers
   * @returns {Promise.<Object>}
   */
  async listUsers() {
    return await this.getRequest("users");
  }

  /**
   * Create User Request
   *
   * @async
   * @method createUser
   * @param {Object} [data]
   * @returns {Promise.<Object>}
   */
  async createUser(data) {
    return await this.postRequest("users", data);
  }

  /**
   * Get User By Address Request
   *
   * @async
   * @method getUserByAddress
   * @param {String} [address]
   * @returns {Promise.<Object>}
   */
  async getUserByAddress(address) {
    return await this.getRequest(`users/${address.toLowerCase()}`);
  }

  /**
   * List Users by Role Request
   *
   * @async
   * @method listUsersByRole
   * @param {String} [role]
   * @returns {Promise.<Object>}
   */
  async listUsersByRole(role) {
    return await this.getRequest(`users/${role.toLowerCase()}`);
  }

  /**
   * Update User Request
   *
   * @async
   * @method updateUser
   * @param {Object} [data]
   * @returns {Promise.<Object>}
   */
  async updateUser(data) {
    return await this.patchRequest(`users/${data.address.toLowerCase()}`, data);
  }

  async deactivateUser() {}
}
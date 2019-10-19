/**
 * @file Manages RibbonBlockchain User requests
 * @author RibbonBlockchain engineers
 */
import HTTP from "./http";
import { getItem } from "../../utils/storage";

export default class UserAPI extends HTTP {
  /**
   * List Users Request
   *
   * @async
   * @method listUsers
   * @returns {Promise.<Object>}
   */
  async listUsers() {
    return await this.getRequest("users", {
      authorization: `Bearer ${getItem("token")}`
    });
  }

  /**
   * Create User Request
   *
   * @async
   * @method createUser
   * @param {Object} [data]
   * @returns {Promise.<Object>}
   */
  async createUser(data, url) {
    return await this.postRequest(`users/${url}`, data, {
      authorization: `Bearer ${getItem("token")}`
    });
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
    return await this.getRequest(`users/${address.toLowerCase()}`, {
      authorization: `Bearer ${getItem("token")}`
    });
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

/**
 * @file Manages RibbonBlockchain Auth requests
 * @author RibbonBlockchain engineers
 */

import HTTP from "./http";

export default class AuthAPI extends HTTP {
  /**
   * Authenticate user
   *
   * @async
   * @method authenticate
   * @param {Object} [data]
   * @returns {Promise.<Object>}
   */
  async authenticate(data) {
    return await this.postRequest("auth", data);
  }
}

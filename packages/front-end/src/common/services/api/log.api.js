/**
 * @file Manages RibbonBlockchain Transaction Logs requests
 * @author RibbonBlockchain engineers
 */
import HTTP from "./http";

export default class LogAPI extends HTTP {
  constructor(token) {
    super();
    this.token = token;
  }

  /**
   * List user transaction logs Request
   *
   * @async
   * @method listLogsByUser
   * @returns {Promise.<Object>}
   */
  async listLogsByUser(address) {
    return await this.getRequest(`transactions/logs/${address}`, {
      authorization: `Bearer ${this.token}`
    });
  }

  /**
   * Create Log Request
   *
   * @async
   * @method createLogs
   * @param {Object} [data]
   * @returns {Promise.<Object>}
   */
  async createLogs(data, url) {
    return await this.postRequest("transactions/logs", data, {
      authorization: `Bearer ${this.token}`
    });
  }
}

/**
 * @file Manages RibbonBlockchain Transaction Logs requests
 * @author RibbonBlockchain engineers
 */
import HTTP from "./http";
import { getItem } from "../../utils/storage";

export default class LogAPU extends HTTP {
  constructor() {
    super();
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
      authorization: `Bearer ${getItem("token")}`
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
      authorization: `Bearer ${getItem("token")}`
    });
  }
}

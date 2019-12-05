/**
 * @file Manages RibbonBlockchain Transaction Logs requests
 * @author RibbonBlockchain engineers
 */
import HTTP from "./http";

export default class ActivityAPI extends HTTP {
  constructor(token) {
    super();
    this.token = token;
  }

  /**
   * List activities Request
   *
   * @async
   * @method listActivities
   * @returns {Promise.<Object>}
   */
  async listActivities() {
    return await this.getRequest(`activities`, {
      authorization: `Bearer ${this.token}`
    });
  }

  /**
   * Add activity
   *
   * @async
   * @method addActivity
   * @param {Object} [data]
   * @returns {Promise.<Object>}
   */
  async addActivity(data, url) {
    return await this.postRequest("activities", data, {
      authorization: `Bearer ${this.token}`
    });
  }
}

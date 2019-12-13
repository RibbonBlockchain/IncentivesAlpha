/**
 * @file Manages RibbonBlockchain Transaction Logs requests
 * @author RibbonBlockchain engineers
 */
import HTTP from "./http";

export default class StatisticsAPI extends HTTP {
  constructor(token) {
    super();
    this.token = token;
  }

  /**
   * Query stats Request
   *
   * @async
   * @method queryStats
   * @returns {Promise.<Object>}
   */
  async queryStats(address, role) {
    return await this.postRequest(`statistics/${address}`, role, {
      authorization: `Bearer ${this.token}`
    });
  }
}

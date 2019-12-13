/**
 * @file Manages RibbonBlockchain Transaction Logs requests
 * @author RibbonBlockchain engineers
 */
import HTTP from "./http";

export default class RatingAPI extends HTTP {
  constructor(token) {
    super();
    this.token = token;
  }

  /**
   * List ratings Request
   *
   * @async
   * @method listRatings
   * @returns {Promise.<Object>}
   */
  async listRatings() {
    return await this.getRequest(`healthcentres/settings`, {
      authorization: `Bearer ${this.token}`
    });
  }

  async fetchExchangeRate() {
    return await this.getRequest(`exchangerates`, {
      authorization: `Bearer ${this.token}`
    });
  }
}

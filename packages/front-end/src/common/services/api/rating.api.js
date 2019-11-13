/**
 * @file Manages RibbonBlockchain Transaction Logs requests
 * @author RibbonBlockchain engineers
 */
import HTTP from "./http";
import { getItem } from "../../utils/storage";

export default class RatingAPI extends HTTP {
  constructor() {
    super();
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
      authorization: `Bearer ${getItem("token")}`
    });
  }
}

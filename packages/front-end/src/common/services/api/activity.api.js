/**
 * @file Manages RibbonBlockchain Transaction Logs requests
 * @author RibbonBlockchain engineers
 */
import HTTP from "./http";
import { getItem } from "../../utils/storage";

export default class ActivityAPI extends HTTP {
  constructor() {
    super();
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
      authorization: `Bearer ${getItem("token")}`
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
      authorization: `Bearer ${getItem("token")}`
    });
  }
}

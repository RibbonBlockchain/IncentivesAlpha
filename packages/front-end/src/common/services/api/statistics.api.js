/**
 * @file Manages RibbonBlockchain Transaction Logs requests
 * @author RibbonBlockchain engineers
 */
import HTTP from "./http";
import { getItem } from "../../utils/storage";

export default class StatisticsAPI extends HTTP {
  constructor() {
    super();
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
      authorization: `Bearer ${getItem("token")}`
    });
  }
}

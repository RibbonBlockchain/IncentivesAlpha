/**
 * @file Manages RibbonBlockchain Interaction requests
 * @author RibbonBlockchain engineers
 */
import HTTP from "./http";
import { getItem } from "../../utils/storage";

export default class InteractionsAPI extends HTTP {
  constructor() {
    super();
  }

  /**
   * List interactions
   *
   * @async
   * @method listInteractions
   * @returns {Promise.<Object>}
   */
  async listInteractions() {
    return await this.getRequest("interactions", {
      authorization: `Bearer ${getItem("token")}`
    });
  }

  /**
   * Create Interaction
   *
   * @async
   * @method createInteraction
   * @param {Object} [data]
   * @returns {Promise.<Object>}
   */
  async createInteraction(data) {
    return await this.postRequest("interactions", data, {
      authorization: `Bearer ${getItem("token")}`
    });
  }

  /**
   * Update Interaction Request
   *
   * @async
   * @method updateInteraction
   * @param {Object} [data]
   * @returns {Promise.<Object>}
   */
  async updateInteraction(data) {
    return await this.patchRequest(`interactions/${data.address}`, data, {
      authorization: `Bearer ${getItem("token")}`
    });
  }
}

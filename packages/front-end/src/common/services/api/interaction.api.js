/**
 * @file Manages RibbonBlockchain Interaction requests
 * @author RibbonBlockchain engineers
 */
import HTTP from "./http";

export default class InteractionsAPI extends HTTP {
  constructor(token) {
    super();
    this.token = token;
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
      authorization: `Bearer ${this.token}`
    });
  }

  /**
   * List interactions
   *
   * @async
   * @method listInteractions
   * @returns {Promise.<Object>}
   */
  async listInteractionByAddress(address, role) {
    return await this.postRequest(`interactions/${address}`, role, {
      authorization: `Bearer ${this.token}`
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
      authorization: `Bearer ${this.token}`
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
      authorization: `Bearer ${this.token}`
    });
  }

  async generateReport(address, date, data) {
    return await this.postRequest(
      `interactions/${address}?date_from=${date.from}&date_to=${date.to}`,
      data,
      {
        authorization: `Bearer ${this.token}`
      }
    );
  }
}

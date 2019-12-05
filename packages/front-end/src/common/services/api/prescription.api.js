/**
 * @file Manages RibbonBlockchain Transaction Logs requests
 * @author RibbonBlockchain engineers
 */
import HTTP from "./http";

export default class PrescriptionAPI extends HTTP {
  constructor(token) {
    super();
    this.token = token;
  }

  /**
   * List prescriptions Request
   *
   * @async
   * @method listPrescriptions
   * @returns {Promise.<Object>}
   */
  async listPrescriptions() {
    return await this.getRequest(`prescriptions`, {
      authorization: `Bearer ${this.token}`
    });
  }

  /**
   * Add prescriptions
   *
   * @async
   * @method addPrescription
   * @param {Object} [data]
   * @returns {Promise.<Object>}
   */
  async addPrescription(data, url) {
    return await this.postRequest("prescriptions", data, {
      authorization: `Bearer ${this.token}`
    });
  }
}

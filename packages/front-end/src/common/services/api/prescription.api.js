/**
 * @file Manages RibbonBlockchain Transaction Logs requests
 * @author RibbonBlockchain engineers
 */
import HTTP from "./http";
import { getItem } from "../../utils/storage";

export default class PrescriptionAPI extends HTTP {
  constructor() {
    super();
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
      authorization: `Bearer ${getItem("token")}`
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
      authorization: `Bearer ${getItem("token")}`
    });
  }
}

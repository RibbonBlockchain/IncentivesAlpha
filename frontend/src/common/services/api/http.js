/**
 * @file Manages RibbonBlockchain API requests
 * @author RibbonBlockchain engineers
 */

import axios from "axios";
import { config } from "../../constants/config";

const DEFAULT_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

export default class HTTP {
  constructor() {
    this.postRequest = this.postRequest.bind();
    this.patchRequest = this.patchRequest.bind();
    this.getRequest = this.getRequest.bind();
  }

  /**
   * Post Request
   *
   * @async
   * @method postRequest
   * @param {String} [url]
   * @param {Object} [body]
   * @param {Object} [headers]
   * @returns {Promise.<Object>}
   */
  async postRequest(url, body, headers = {}) {
    let endpoint = `${config.API_ENDPOINT}/${url}`;
    return await handleRequest("POST", endpoint, { body, headers });
  }

  /**
   * Patch Request
   *
   * @async
   * @method patchRequest
   * @param {String} [url]
   * @param {Object} [body]
   * @param {Object} [headers]
   * @returns {Promise.<Object>}
   */
  async patchRequest(url, body, headers = "") {
    let endpoint = `${config.API_ENDPOINT}/${url}`;
    return await handleRequest("PATCH", endpoint, { body, headers });
  }

  /**
   * Get Request
   *
   * @async
   * @method getRequest
   * @param {String} [url]
   * @param {Object} [body]
   * @param {Object} [headers]
   * @returns {Promise.<Object>}
   */
  async getRequest(url, headers = "") {
    let endpoint = `${config.API_ENDPOINT}/${url}`;
    return await handleRequest("GET", endpoint, { headers });
  }
}

const handleRequest = async function(method, url, reqStruct) {
  return await fetch(url, {
    method,
    body: reqStruct.body && JSON.stringify(reqStruct.body),
    headers: {
      ...DEFAULT_HEADERS,
      ...reqStruct.headers
    }
  }).then(response => response.json());
  //   return await axios({
  //     method,
  //     url,
  //     data: {
  //       ...reqStruct.body
  //     },
  //     headers: {
  //       ...DEFAULT_HEADERS,
  //       ...reqStruct.headers
  //     }
  //   });
};

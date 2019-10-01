import * as axios from "axios";
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

  async postRequest(url, body, headers = "") {
    let endpoint = `${config.API_ENDPOINT}/${url}`;
    return await handleRequest("POST", endpoint, { body, headers });
  }

  async patchRequest(url, body, headers = "") {
    let endpoint = `${config.API_ENDPOINT}/${url}`;
    return await handleRequest("PATCH", endpoint, { body, headers });
  }

  async getRequest(url, headers = "") {
    let endpoint = `${config.API_ENDPOINT}/${url}`;
    return await handleRequest("GET", endpoint, { headers });
  }
}

const handleRequest = async function(method, url, reqStruct) {
  return await axios({
    method,
    url,
    data: {
      ...reqStruct.body
    },
    headers: {
      ...DEFAULT_HEADERS,
      ...reqStruct.headers
    }
  });
};

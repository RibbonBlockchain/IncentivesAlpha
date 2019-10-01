import * as axios from "axios";
import { config } from "../../constants/config";

const DEFAULT_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

export default class HTTP {
  constructor() {
    this.BASE_URL = config.API_ENDPOINT;
  }
  async postRequest(url, body, headers = "") {
    let endpoint = `${this.BASE_URL}/${url}`;
    return handleRequest("POST", endpoint, { body, headers });
  }

  async patchRequest(url, body, headers = "") {
    let endpoint = `${this.BASE_URL}/${url}`;
    return handleRequest("PATCH", endpoint, { body, headers });
  }

  async getRequest(url, headers = "") {
    let endpoint = `${this.BASE_URL}/${url}`;
    return handleRequest("GET", endpoint, { headers });
  }
}

const handleRequest = async function(method, url, reqStruct) {
  return axios({
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

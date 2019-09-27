import * as axios from "axios";

const DEFAULT_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

export default class HTTP {
  static async postRequest(url, body, headers = "") {
    return handleRequest("POST", url, { body, headers });
  }

  static async getRequest(url, headers = "") {
    return handleRequest("GET", url, { headers });
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

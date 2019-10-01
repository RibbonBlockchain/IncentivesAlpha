import HTTP from "./http";

export default class AuthAPI extends HTTP {
  constructor() {
    super();
  }

  async authenticate(data) {
    return await this.postRequest("auth", data);
  }
}

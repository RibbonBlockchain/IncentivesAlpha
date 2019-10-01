import HTTP from "./http";

export default class AuthAPI extends HTTP {
  constructor() {
    super();
    this.authenticate = this.authenticate.bind();
  }

  async authenticate(data) {
    await this.postRequest("auth", data)
      .then(result => {
        return result;
      })
      .catch(error => {
        return error;
      });
  }
}

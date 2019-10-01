import HTTP from "./http";

export default class Interactions extends HTTP {
  constructor() {
    super();
  }

  async listInteractions() {
    return await this.getRequest("interactions")
      .then(result => {
        return result;
      })
      .catch(error => {
        return error;
      });
  }

  async createInteraction(data) {
    return await this.postRequest("interactions", data)
      .then(result => {
        return result;
      })
      .catch(error => {
        return error;
      });
  }

  async updateInteraction(data) {
    return await this.patchRequest(
      `interactions/${data.address.toLowerCase()}`,
      data
    )
      .then(result => {
        return result;
      })
      .catch(error => {
        return error;
      });
  }
}

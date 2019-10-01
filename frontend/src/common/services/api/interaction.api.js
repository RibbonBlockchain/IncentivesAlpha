import HTTP from "./http";

export default class Interactions extends HTTP {
  constructor() {
    super();
  }

  async listInteractions() {
    return await this.getRequest("interactions");
  }

  async createInteraction(data) {
    return await this.postRequest("interactions", data)
  }

  async updateInteraction(data) {
    return await this.patchRequest(
      `interactions/${data.address.toLowerCase()}`,
      data
    )
  }
}

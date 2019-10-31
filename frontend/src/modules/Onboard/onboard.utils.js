import RegistryContract from "../../common/services/blockchain/apps/registry";
import UserAPI from "../../common/services/api/user.api";
import { getRoleURL } from "../../common/constants/roles";

export async function createNewUser(data) {
  let contract = new RegistryContract();
  let userAPI = new UserAPI();

  let { publicAddress, role } = data;

  try {
    let tx = await contract.addUser(publicAddress, role);
    if (tx.transactionHash) {
      let user = await userAPI.createUser(data, getRoleURL(role));
      if (user.error) {
        return {
          error: user.error
        };
      } else if (user.message) {
        return {
          error: user.message
        };
      } else {
        return {
          user: user.data
        };
      }
    } else {
      return {
        error: `An error occured. Please try again`
      };
    }
  } catch (error) {
    return {
      error
    };
  }
}

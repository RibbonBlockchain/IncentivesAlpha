import RegistryContract from "../../common/services/blockchain/apps/registry";
import UserAPI from "../../common/services/api/user.api";
import { getRoleURL } from "../../common/constants/roles";

export async function createNewUser(data) {
  let contract = new RegistryContract();

  let { publicAddress, role } = data;

  try {
    let tx = await contract.addUser(publicAddress, role);
    if (tx.hash) {
      return tx.hash;
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

export async function recordNewUser(data, token) {
  let userAPI = new UserAPI(token);
  let { role } = data;
  let user = null;

  if (data.parent_id) {
    user = await userAPI.createUser(data, "minors");
  } else {
    user = await userAPI.createUser(data, getRoleURL(role));
  }
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
}

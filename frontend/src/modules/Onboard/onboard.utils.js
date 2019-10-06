import RegistryContract from "../../common/services/blockchain/apps/registry";
import UserAPI from "../../common/services/api/user.api";

export async function createNewUser(data) {
  let contract = new RegistryContract();
  let userAPI = new UserAPI();

  let { publicAddress, role } = data;

  try {
    // let tx = await contract.addUser(publicAddress, role);
    // if (tx.hash) {
    let user = await userAPI.createUser(data);
    if (user) {
      return {
        user
      };
    } else {
      return {
        error: `An error occured. Please try again`
      };
    }
    // } else {
    //   return {
    //     error: `An error occured. Please try again`
    //   };
    // }
  } catch (error) {
    return {
      error
    };
  }
}

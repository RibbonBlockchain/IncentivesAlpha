import RegistryContract from "../../common/services/blockchain/apps/registry";
import AdminContract from "../../common/services/blockchain/apps/admin";
import UserAPI from "../../common/services/api/user.api";

export async function createHealthWorker(data) {
  let contract = new RegistryContract();
  let userAPI = new UserAPI();

  let { publicAddress, role } = data;
  try {
    let tx = await contract.addUser(publicAddress, role);

    console.log(tx);
    // let wait = await tx.wait();

    // console.log(wait);
    // if (tx) {
    //   let addUserOffChain = await userAPI.createUser(data);
    //   return {
    //     data: addUserOffChain
    //   };
    // } else {
    //   return {
    //     error: "An error occured. Please try again"
    //   };
    // }
  } catch (error) {
    return {
      error
    };
  }
}

export async function addWhitelistAdmin(address) {
  let contract = new RegistryContract();
  try {
    let tx = await contract.addWhitelistAdmin(address);
    console.log(tx);
  } catch (error) {
    console.log(error);
  }
}

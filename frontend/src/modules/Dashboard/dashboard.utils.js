import UserAPI from "../../common/services/api/user.api";
import VaultContract from "../../common/services/blockchain/apps/vault";

export const loadUsers = async () => {
  let userAPI = new UserAPI();

  let listUsers = await userAPI.listUsers();
  return listUsers.data;
};

export const getRoleCount = (userList, role) => {
  return userList
    .map(object => object.role === role)
    .reduce((accumulator, object) => accumulator + object, 0);
};

export const makeDonation = async ({ value, message }) => {
  let vaultContract = new VaultContract();

  let memo = message ? message : "Making donation";

  let tx = await vaultContract.donateFunds(value, memo);
  if (tx.hash) {
    return {
      message: "Donation has been received."
    };
  } else {
    return {
      message: tx.stack.split(":")[2]
    };
  }
};

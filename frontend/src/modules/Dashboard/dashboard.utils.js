import UserAPI from "../../common/services/api/user.api";
import VaultContract from "../../common/services/blockchain/apps/vault";

export const loadUsers = async () => {
  let userAPI = new UserAPI();

  let listUsers = await userAPI.listUsers();
  return listUsers.data;
};

export const getRoleCount = (userList, role) => {
  return userList.length > 0
    ? userList
        .map(object => object.role === role)
        .reduce((accumulator, object) => accumulator + object, 0)
    : "0";
};

export const makeDonation = async ({ value, message }) => {
  let vaultContract = new VaultContract();

  let memo = message ? message : "Making donation";

  let tx = await vaultContract.donateFunds(value, memo);
  console.log(tx);
  if (tx.hash) {
    return tx.hash;
  } else {
    return {
      error: tx.stack.split(":")[2]
    };
  }
};

export const sendTokens = async ({ amount, receipient, message }) => {
  let vaultContract = new VaultContract();
  let memo = message ? message : `Sending ${amount} tokens to ${receipient}`;

  let tx = await vaultContract.sendTokens({ amount, receipient });
  if (tx.hash) {
    return tx.hash;
  } else {
    return {
      error: tx.stack.split(":")[2]
    };
  }
};

export const formatActivityOptions = options => {
  return (
    options.length > 0 &&
    options.map(option => ({
      label: option.activityTitle,
      value: option
    }))
  );
};

export const formatPrescriptionOptions = options => {
  return (
    options.length > 0 &&
    options.map(option => ({
      label: option.prescriptionTitle,
      value: option
    }))
  );
};

export const getByRole = (users, role) => {
  let data = [];
  users.length > 0 &&
    users.map(user => {
      if (user.role === role) {
        data.push({
          label: user.idNumber,
          value: user
        });
      }
    });
  return data;
};

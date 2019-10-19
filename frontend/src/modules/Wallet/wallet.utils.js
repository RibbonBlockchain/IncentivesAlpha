import VaultContract from "../../common/services/blockchain/apps/vault";
import UserAPI from "../../common/services/api/user.api";

export const getUser = async address => {
  let vaultContract = new VaultContract();
  let userAPI = new UserAPI();

  let user = await userAPI.getUserByAddress(address);

  return {
    api: user.data
  };
};

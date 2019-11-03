import UserAPI from "../../common/services/api/user.api";

export const getUser = async address => {
  let userAPI = new UserAPI();

  return await userAPI.getUserByAddress(address);
};

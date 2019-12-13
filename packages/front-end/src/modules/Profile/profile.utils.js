import UserAPI from "../../common/services/api/user.api";

export async function updateUserProfile(data, token) {
  let userAPI = new UserAPI(token);

  try {
    let user = await userAPI.updateUser(data);
    if (user.error) {
      return {
        error: user.error
      };
    } else if (user.message.code) {
      return {
        error: user.message.code
      };
    } else {
      return {
        user: user.data
      };
    }
  } catch (error) {
    return {
      error
    };
  }
}

import reducerUtil from "../../common/utils/reducer.util";
import { LOGIN_SUCCESS } from "../../common/constants/login";
import { initialState } from "../../common/models/login";

const success = (state, payload) => {
  return Object.assign({}, state.auth, {
    loginType: payload.loginType,
    token: payload.authWithAPI.token,
    address: payload.publicAddress
  });
};

const map = {
  [LOGIN_SUCCESS]: success
};

export default reducerUtil(map, { ...initialState });

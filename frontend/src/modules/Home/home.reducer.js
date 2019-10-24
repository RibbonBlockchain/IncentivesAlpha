import reducerUtil from "../../common/utils/reducer.util";
import { LOAD_USER } from "../../common/constants/dashboard";
import { userState } from "../../common/models/dashboard";

const loadData = (state, payload) => {
  return Object.assign({}, state.user, {
    data: payload
  });
};

const map = {
  [LOAD_USER]: loadData
};

export default reducerUtil(map, { ...userState });

import reducerUtil from "../../common/utils/reducer.util";
import { LOAD_DATA } from "../../common/constants/dashboard";
import { initialState } from "../../common/models/dashboard";

const loadData = (state, payload) => {
  return Object.assign({}, state.dapp, {
    data: payload
  });
};

const map = {
  [LOAD_DATA]: loadData
};

export default reducerUtil(map, { ...initialState });

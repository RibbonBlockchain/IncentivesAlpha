import reducerUtil from "../../common/utils/reducer.util";
import { SHOW_WALLET, HIDE_WALLET } from "../../common/constants/wallet";
import { alertInitialState } from "../../common/models/wallet";

const show = (state, payload) => {
  return Object.assign({}, state.wallet, {
    visible: true
  });
};

const hide = state => {
  return Object.assign({}, state.wallet, {
    visible: false
  });
};

const map = {
  [SHOW_WALLET]: show,
  [HIDE_WALLET]: hide
};

export default reducerUtil(map, { ...alertInitialState });

import reducerUtil from "../../common/utils/reducer.util";
import { SHOW_ALERT, HIDE_ALERT } from "../../common/constants/alert";
import { alertInitialState } from "../../common/models/alert";

const show = (state, payload) => {
  return Object.assign({}, state.alert, {
    visible: true,
    message: payload
  });
};

const hide = state => {
  return Object.assign({}, state.alert, {
    visible: false
  });
};

const map = {
  [SHOW_ALERT]: show,
  [HIDE_ALERT]: hide
};

export default reducerUtil(map, { ...alertInitialState });

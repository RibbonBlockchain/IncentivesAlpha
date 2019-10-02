import reducerUtil from "../../common/utils/reducer.util";
import {
  SHOW_QR_REGISTRATION_MODAL,
  HIDE_QR_REGISTRATION_MODAL
} from "../../common/constants/qr";
import { qrInitialState } from "../../common/models/qr";

const show = (state, payload) => {
  return Object.assign({}, state.qrRegistration, {
    visible: true,
    message: payload.message
  });
};

const hide = state => {
  return Object.assign({}, state.qrRegistration, {
    visible: false,
    message: ""
  });
};

const map = {
  [SHOW_QR_REGISTRATION_MODAL]: show,
  [HIDE_QR_REGISTRATION_MODAL]: hide
};

export default reducerUtil(map, { ...qrInitialState });

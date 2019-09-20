import { APP_INITIALIZED } from "../../constants/web3";

const initialState = {};

const scatterReducer = (state = initialState, action) => {
  if (action.type === APP_INITIALIZED) {
    return Object.assign({}, state, action.payload);
  }
  return state;
};

export default scatterReducer;

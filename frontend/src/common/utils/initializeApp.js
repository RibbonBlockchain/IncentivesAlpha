import store from "../redux";
import { APP_INITIALIZED } from "../constants/web3";

const appInitialized = appInstance => {
  return { payload: appInstance, type: APP_INITIALIZED };
};

const initializeApp = (web3, dispatch = store.dispatch.bind(store)) =>
  new Promise((resolve, reject) => {
    if (web3) {
      resolve(dispatch(appInitialized(web3)));
    } else {
      const web3Data = {};
      reject(dispatch(appInitialized(web3Data)));
    }
  });

export default initializeApp;

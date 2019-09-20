import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import web3Reducer from "../utils/web3/web3.reducer";
import alertReducer from "../../modules/Alert/Alert.reducer";
export default history =>
  combineReducers({
    router: connectRouter(history),
    web3: web3Reducer,
    alert: alertReducer
  });

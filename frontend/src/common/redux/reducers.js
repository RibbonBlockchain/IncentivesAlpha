import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import web3Reducer from "../utils/web3/web3.reducer";
import alertReducer from "../../modules/Alert/Alert.reducer";
import walletReducer from "../../modules/Wallet/Wallet.reducer";
import QRReducer from "../../modules/QRCodeDisplay/QRCodeDisplay.reducer";
import LoginReducer from "../../modules/Login/login.reducer";
import DashboardReducer from "../../modules/Dashboard/dashboard.reducer";
import HomeReducer from "../../modules/Home/home.reducer";
export default history =>
  combineReducers({
    router: connectRouter(history),
    web3: web3Reducer,
    alert: alertReducer,
    wallet: walletReducer,
    qrRegistration: QRReducer,
    auth: LoginReducer,
    dapp: DashboardReducer,
    user: HomeReducer
  });

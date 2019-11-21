import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
  useCallback
} from "react";
import RegistryContract from "../services/blockchain/apps/registry";
import UserAPI from "../services/api/user.api";
import { useAlert } from "./Modal.provider";
import { setItem, getItem } from "../utils/storage";
import { getNetworkDetails } from "../utils";

const Web3Context = createContext();

const useWeb3Context = () => useContext(Web3Context);

const initialState = () => ({
  token: null,
  address: null,
  loginType: 0,
  balance: 0,
  user: {},
  network: "Unknown"
});

const UPDATE_WEB3 = "web3/UPDATE_WEB3";

const reducer = (state, { type, payload }) => {
  let { token, address, loginType, balance, user, network } = payload;
  switch (type) {
    case UPDATE_WEB3:
      return {
        ...state,
        token,
        address,
        balance,
        loginType,
        user,
        network
      };
    default: {
      throw new Error(`Unknown action type ${type}`);
    }
  }
};

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const update = useCallback(payload => {
    dispatch({
      type: UPDATE_WEB3,
      payload
    });
  }, []);

  return (
    <Web3Context.Provider
      value={useMemo(() => [state, { update }], [state, update])}
    >
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => {
  const [
    { address, token, balance, user, loginType },
    { update }
  ] = useWeb3Context();
  const [, toggleModal] = useAlert();

  const login = async ({ token, address, loginType }) => {
	update({ token, address, loginType });
    setItem("token", token);
    setItem("address", address);

    window.location.reload();
  };

  const getWalletDetails = async () => {
    let registryContract = new RegistryContract();
    const userAPI = new UserAPI();
    let { provider, ethers, signer } = await registryContract.getInstance();

    let {
      networkAddress,
      currentBalance,
      currentNetwork,
      loginType,
      error
    } = await getNetworkDetails(provider, signer, registryContract);
    if (error) {
      toggleModal({
        isVisible: true,
        message: error
      });
    } else {
      let token = getItem("token") || null;
      let user = await userAPI.getUserByAddress(networkAddress);
      await update({
        address: networkAddress,
        balance: ethers.utils.formatEther(currentBalance),
        loginType,
        token,
        user,
        network: currentNetwork
      });
    }
  };

  return [
    { address, token, loginType, balance, user },
    login,
    getWalletDetails
  ];
};

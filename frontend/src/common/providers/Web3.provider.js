import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
  useCallback
} from "react";
import RegistryContract from "../services/blockchain/apps/registry";
import AuthAPI from "../services/api/auth.api";
import UserAPI from "../services/api/user.api";
import { useAlert } from "./Modal.provider";
import { setItem, getItem } from "../utils/storage";

const Web3Context = createContext();

const useWeb3Context = () => useContext(Web3Context);

const initialState = () => ({
  token: null,
  address: null,
  loginType: 0,
  balance: 0,
  user: {}
});

const UPDATE_WEB3 = "web3/UPDATE_WEB3";

const reducer = (state, { type, payload }) => {
  let { token, address, loginType, balance, user } = payload;
  switch (type) {
    case UPDATE_WEB3:
      return {
        ...state,
        token,
        address,
        balance,
        loginType,
        user
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

  const login = async ({ token, address, loginType }) => {
    update({ token, address, loginType });
    setItem("token", token);
    setItem("address", address);

    window.location.reload();
  };

  useEffect(() => {
    getWalletDetails();
  }, []);

  const getWalletDetails = async () => {
    let registryContract = new RegistryContract();
    const userAPI = new UserAPI();
    let { provider, ethers, signer } = await registryContract.getInstance();

    let address = getItem("address") || (await signer.getAddress());
    let balance = await provider.getBalance(address);
    let loginType = await registryContract.getUserRole(address);
    let token = getItem("token") || null;
    let user = await userAPI.getUserByAddress(address);

    await update({
      address,
      balance: ethers.utils.formatEther(balance),
      loginType,
      token,
      user
    });
  };

  return [{ address, token, loginType, balance, user }, login];
};

const processLogin = async () => {
  let registryContract = new RegistryContract();
  let authAPI = new AuthAPI();
  let { ethers, signer, provider } = await registryContract.getInstance();
  try {
    let nonce = `Signing into RibbonBlockchain Dapp`;
    let signature = await signer.signMessage(nonce);
    let publicAddress = await signer.getAddress();
    let recoveredAddress = await ethers.utils.verifyMessage(nonce, signature);
    if (recoveredAddress !== publicAddress) {
      return {
        error: `Address recovered do not match, original ${publicAddress} versus computed ${recoveredAddress}`
      };
    }
    try {
      let authWithAPI = await authAPI.authenticate({
        publicAddress,
        signature
      });
      if (authWithAPI.error) {
        return {
          error: authWithAPI.error,
          publicAddress
        };
      } else {
        let loginType = await registryContract.getUserRole(publicAddress);
        let balance = await provider.getBalance(publicAddress);
        return {
          authWithAPI,
          publicAddress,
          loginType,
          balance: ethers.utils.formatEther(balance)
        };
      }
    } catch (error) {
      return {
        error
      };
    }
  } catch (error) {
    return {
      error
    };
  }
};

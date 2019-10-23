import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
  useCallback
} from "react";
import UserAPI from "../services/api/user.api";
import InteractionsAPI from "../services/api/interaction.api";
import LogAPI from "../services/api/log.api";
import { useWeb3 } from "./Web3.provider";

const APIContext = createContext();

const useAPIContext = () => useContext(APIContext);

const initialState = () => ({
  users: [],
  interactions: [],
  transactionLogs: []
});

const UPDATE = "api/UPDATE";

const reducer = (state, { type, payload }) => {
  switch (type) {
    case UPDATE:
      const { users, interactions, transactionLogs } = payload;
      return {
        ...state,
        ...users,
        ...interactions
      };
    default: {
      throw new Error(`Unexpected action type ${type}`);
    }
  }
};

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const update = useCallback((users, user, interactions, transactionLogs) => {
    dispatch({
      type: UPDATE,
      payload: {
        users,
        interactions
      }
    });
  });
  return (
    <APIContext.Provider
      value={useMemo(() => [state, { update }], [state, update])}
    >
      {children}
    </APIContext.Provider>
  );
}

export const useData = () => {
  const usersAPI = new UserAPI();
  const interactionsAPI = new InteractionsAPI();
  const [state, { update }] = useAPIContext();
  const [{ address, loginType }] = useWeb3();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let users = await usersAPI.listUsers();
    let interactions = await interactionsAPI.listInteractionByAddress(address, {
      role: loginType
    });
    update({
      users: users.length > 0 ? users : state.users,
      interactions: interactions.length > 0 ? interactions : state.interactions
    });
  };

  return [state, fetchData];
};

export const useTransactions = () => {
  const transactionLogsAPI = new LogAPI();
  const [{ address }] = useWeb3();
  const [state, { update }] = useAPIContext();

  useEffect(() => {
    fetchTransactionLogs();
  }, [address]);

  const fetchTransactionLogs = async () => {
    let transactionLogs =
      address && (await transactionLogsAPI.listLogsByUser(address));
    update({
      users: state.users,
      interactions: state.interactions,
      transactionLogs
    });
  };
  return [state, fetchTransactionLogs];
};

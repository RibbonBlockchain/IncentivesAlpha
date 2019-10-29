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
import { useWeb3 } from "./Web3.provider";

const APIContext = createContext();

const useAPIContext = () => useContext(APIContext);

const initialState = () => ({
  users: [],
  interactions: []
});

const UPDATE = "api/UPDATE";

const reducer = (state, { type, payload }) => {
  switch (type) {
    case UPDATE:
      const { users, interactions } = payload;
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

  const update = useCallback((users, interactions) => {
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
  const [{ users, interactions }, { update }] = useAPIContext();
  const [{ address, loginType }] = useWeb3();

  useEffect(() => {
    fetchData();
  }, [address]);

  const fetchData = async () => {
    if (address !== null) {
      let listUsers = await usersAPI.listUsers();
      let listInteractions = await interactionsAPI.listInteractionByAddress(
        address,
        {
          role: loginType
        }
      );
      update({
        users: listUsers,
        interactions: listInteractions
      });
    } else {
      update({
        users,
        interactions
      });
    }
  };

  return [{ users, interactions }, fetchData];
};

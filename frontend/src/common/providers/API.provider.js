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
import { getItem } from "../utils/storage";

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
  const [{ loginType }] = useWeb3();
  let address = getItem("address");

  const fetchData = async () => {
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
  };

  return [{ users, interactions }, fetchData];
};

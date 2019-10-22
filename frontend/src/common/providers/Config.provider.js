import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
  useCallback
} from "react";

const ConfigContext = createContext();

const useConfigContext = () => useContext(ConfigContext);

const initialState = () => ({
  currency: "eth"
});

const LOAD_CONFIGURATION = "config/LOAD_CONFIGURATION";

const reducer = (state, { type, payload }) => {
  const { currency } = payload;
  switch (type) {
    case LOAD_CONFIGURATION:
      return {
        ...state,
        currency
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
      type: LOAD_CONFIGURATION,
      payload
    });
  }, []);

  return (
    <ConfigContext.Provider
      value={useMemo(() => [state, { update }], [state, update])}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export const useCurrency = () => {
  const [{ currency }, { update }] = useConfigContext();

  const loadCurrency = () => {
    //   go to api to fetch app setup details
    // update the state
  };

  return [{ currency }, loadCurrency];
};

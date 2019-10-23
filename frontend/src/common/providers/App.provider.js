import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
  useCallback
} from "react";

const AppContext = createContext();

const useAppContext = () => useContext(AppContext);

const initialState = () => ({
  currency: "eth",
  activities: [],
  prescriptions: []
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
    <AppContext.Provider
      value={useMemo(() => [state, { update }], [state, update])}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const [
    { currency, activities, prescriptions, ratings },
    { update }
  ] = useAppContext();

  useEffect(() => {
    loadCurrency();
    loadActivities();
    loadPrescriptions();
    loadRatings();
  }, [currency, activities, prescriptions, ratings]);

  const loadCurrency = () => {
    //   go to api to fetch app setup details
    // update the state
  };
  const loadActivities = () => {};

  const loadPrescriptions = () => {};

  const loadRatings = () => {};

  return [{ currency, activities, prescriptions, ratings }, loadCurrency];
};

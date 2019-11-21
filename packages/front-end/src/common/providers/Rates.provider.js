import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
  useCallback
} from "react";

const ExchangeRateContext = createContext();

const useExchangeRateContext = () => useContext(ExchangeRateContext);

const initialState = () => ({
  exchangeRate: 1
});

const LOAD_RATES = "config/LOAD_RATES";

const reducer = (state, { type, payload }) => {
  const { exchangeRate } = payload;
  switch (type) {
    case LOAD_RATES:
      return {
        ...state,
        exchangeRate
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
      type: LOAD_RATES,
      payload
    });
  }, []);

  return (
    <ExchangeRateContext.Provider
      value={useMemo(() => [state, { update }], [state, update])}
    >
      {children}
    </ExchangeRateContext.Provider>
  );
}

export const useExchange = () => {
  const [{ exchangeRate }, { update }] = useExchangeRateContext();

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=dai&vs_currencies=usd"
      )
        .then(response => response.json())
        .then(response =>
          update({
            exchangeRate: response.dai.usd
          })
        );
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return [{ exchangeRate }];
};

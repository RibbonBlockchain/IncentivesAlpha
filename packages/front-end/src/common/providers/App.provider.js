import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback
} from "react";
import PrescriptionAPI from "../services/api/prescription.api";
import ActivityAPI from "../services/api/activity.api";
import RatingAPI from "../services/api/rating.api";
import { useWeb3 } from "./Web3.provider";

const AppContext = createContext();

const useAppContext = () => useContext(AppContext);

const initialState = () => ({
  currency: "xdai",
  currencyRate: 0,
  activityList: [],
  prescriptionList: [],
  ratingList: [{ ratingTypes: [] }]
});

const LOAD_CONFIGURATION = "config/LOAD_CONFIGURATION";

const reducer = (state, { type, payload }) => {
  const {
    currency,
    currencyRate,
    activityList,
    prescriptionList,
    ratingList
  } = payload;
  switch (type) {
    case LOAD_CONFIGURATION:
      return {
        ...state,
        currency,
        currencyRate,
        activityList,
        prescriptionList,
        ratingList
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
  const [state, { update }] = useAppContext();
  const [{ token }] = useWeb3();

  const prescriptionAPI = new PrescriptionAPI(token);
  const activityAPI = new ActivityAPI(token);
  const ratingAPI = new RatingAPI(token);
  const {
    currency,
    currencyRate,
    activityList,
    prescriptionList,
    ratingList
  } = state;

  const loadDetails = async () => {
    let activityList = await activityAPI.listActivities();
    let prescriptionList = await prescriptionAPI.listPrescriptions();
    let ratings = await ratingAPI.listRatings();
    let currencyRate = await ratingAPI.fetchExchangeRate();
    await update({
      activityList,
      currency: currency,
      currencyRate: currencyRate,
      prescriptionList,
      ratingList: ratings.length > 0 ? ratings : ratingList
    });
  };

  return [
    { currency, activityList, currencyRate, prescriptionList, ratingList },
    loadDetails
  ];
};

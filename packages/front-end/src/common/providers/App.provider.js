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

const AppContext = createContext();

const useAppContext = () => useContext(AppContext);

const initialState = () => ({
  currency: "poa",
  activityList: [],
  prescriptionList: [],
  ratings: []
});

const LOAD_CONFIGURATION = "config/LOAD_CONFIGURATION";

const reducer = (state, { type, payload }) => {
  const { currency, activityList, prescriptionList, ratingList } = payload;
  switch (type) {
    case LOAD_CONFIGURATION:
      return {
        ...state,
        currency,
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

  const prescriptionAPI = new PrescriptionAPI();
  const activityAPI = new ActivityAPI();
  const ratingAPI = new RatingAPI();
  const { currency, activityList, prescriptionList, ratingList } = state;

  const loadDetails = async () => {
    let activityList = await activityAPI.listActivities();
    let prescriptionList = await prescriptionAPI.listPrescriptions();
    let ratingList = await ratingAPI.listRatings();
    await update({
      activityList,
      currency: state.currency,
      prescriptionList,
      ratingList
    });
  };

  return [{ currency, activityList, prescriptionList, ratingList }, loadDetails];
};

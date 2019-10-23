import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
  useCallback
} from "react";
import PrescriptionAPI from "../services/api/prescription.api";
import ActivityAPI from "../services/api/activity.api";

const AppContext = createContext();

const useAppContext = () => useContext(AppContext);

const initialState = () => ({
  currency: "eth",
  activities: [],
  prescriptions: []
});

const LOAD_CONFIGURATION = "config/LOAD_CONFIGURATION";

const reducer = (state, { type, payload }) => {
  const { currency, activities, prescriptions } = payload;
  switch (type) {
    case LOAD_CONFIGURATION:
      return {
        ...state,
        currency,
        ...activities,
        ...prescriptions
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
  const { currency, activities, prescriptions, ratings } = state;

  useEffect(() => {
    loadCurrency();
    loadActivities();
    loadPrescriptions();
    loadRatings();
  }, []);

  const loadCurrency = async () => {
    //   go to api to fetch app setup details
    // update the state
  };
  const loadActivities = async () => {
    let activities = await activityAPI.listActivities();
    update({
      activities,
      currency: state.currency,
      prescriptions: state.prescriptions
    });
  };

  const loadPrescriptions = async () => {
    let prescriptions = await prescriptionAPI.listPrescriptions();
    update({
      activities: state.activities,
      currency: state.currency,
      prescriptions
    });
  };

  const loadRatings = async () => {};

  return [{ currency, activities, prescriptions, ratings }, loadCurrency];
};

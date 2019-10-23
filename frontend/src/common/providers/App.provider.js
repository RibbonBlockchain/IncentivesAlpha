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
  currency: "poa",
  activityList: [],
  prescriptionList: []
});

const LOAD_CONFIGURATION = "config/LOAD_CONFIGURATION";

const reducer = (state, { type, payload }) => {
  const { currency, activityList, prescriptionList } = payload;
  switch (type) {
    case LOAD_CONFIGURATION:
      return {
        ...state,
        currency,
        activityList,
        prescriptionList
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
  const { currency, activityList, prescriptionList, ratings } = state;

  useEffect(() => {
    loadAppConfigs();
  }, []);

  const loadAppConfigs = async () => {
    let activityList = await activityAPI.listActivities();
    let prescriptionList = await prescriptionAPI.listPrescriptions();

    update({
      activityList,
      currency: state.currency,
      prescriptionList
    });
  };

  return [{ currency, activityList, prescriptionList, ratings }];
};

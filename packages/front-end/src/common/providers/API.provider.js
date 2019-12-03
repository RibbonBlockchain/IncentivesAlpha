import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback
} from "react";
import moment from "moment";
import UserAPI from "../services/api/user.api";
import InteractionsAPI from "../services/api/interaction.api";
import { useWeb3 } from "./Web3.provider";
import { useApp } from "./App.provider";
import { getItem } from "../utils/storage";
import { roleNames } from "../constants/roles";

const APIContext = createContext();

const useAPIContext = () => useContext(APIContext);

const initialState = () => ({
  users: [],
  interactions: [],
  dashboard: {
    admin: {
      admin: {
        thisWeekData: 0,
        thisMonthData: 0,
        ratings: 0,
        overall: 0
      },
      chw: {
        thisWeekData: 0,
        thisMonthData: 0
      },
      patients: {
        thisWeekData: 0,
        thisMonthData: 0
      },
      practitioners: {
        thisWeekData: 0,
        thisMonthData: 0
      },
      interactions: {
        thisWeekData: 0,
        thisMonthData: 0
      }
    },
    chw: {
      interactions: {
        overall: 0,
        thisWeekData: 0,
        thisMonthData: 0
      },
      patients: {
        thisWeekData: 0,
        thisMonthData: 0
      },
      practitioners: {
        thisWeekData: 0,
        thisMonthData: 0
      },
      chw: {
        thisWeekData: 0,
        thisMonthData: 0,
        overall: 0,
        ratings: 0,
        earnings: 0
      }
    },
    patient: {
      overall: 0,
      thisWeekData: 0,
      thisMonthData: 0,
      ratings: 0,
      earnings: 0
    },
    practitioner: {
      overall: 0,
      thisWeekData: 0,
      thisMonthData: 0,
      ratings: 0,
      earnings: 0
    }
  }
});

const UPDATE = "api/UPDATE";

const reducer = (state, { type, payload }) => {
  switch (type) {
    case UPDATE:
      const { users, interactions, dashboard } = payload;
      return {
        ...state,
        ...users,
        ...interactions,
        ...dashboard
      };
    default: {
      throw new Error(`Unexpected action type ${type}`);
    }
  }
};

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const update = useCallback((users, interactions, dashboard) => {
    dispatch({
      type: UPDATE,
      payload: {
        users,
        interactions,
        dashboard
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
  const [{ users, interactions, dashboard }, { update }] = useAPIContext();
  const [{ loginType, user }] = useWeb3();
  const [{ ratingList }] = useApp();
  let address = getItem("address");

  const fetchData = async () => {
    if (loginType > 0) {
      let listUsers = await usersAPI.listUsers();
      let listInteractions = await interactionsAPI.listInteractionByAddress(
        address,
        {
          role: loginType
        }
      );
      update({
        users: listUsers,
        dashboard: {
          admin: {
            patients: await getAdminStats(listUsers, roleNames.PATIENT),
            practitioners: await getAdminStats(
              listUsers,
              roleNames.PRACTITIONER
            ),
            chw: await getAdminStats(listUsers, roleNames.HEALTH_WORKER),
            admin: await getAdminStats(listUsers, roleNames.SUPER_ADMIN),
            interactions: await getCHWData(listInteractions)
          },
          patient: await getPatientData(listInteractions, address),
          practitioner: await getPractitionerData(listInteractions, address),
          chw: {
            patients: await getCHWStatsPatients(listUsers, user),
            practitioners: await getCHWStatsPractitioners(listUsers, user),
            interactions: await getCHWData(listInteractions, address),
            chw: await getCHWDataResult(listInteractions, address)
          }
        },
        interactions:
          listInteractions.length > 0
            ? listInteractions.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
              )
            : []
      });
    }
  };

  const getAdminStats = async (users, type) => {
    if (users.length > 0) {
      let minors = users
        .map(user => user.minors)
        .filter(minor => minor.length > 0 && minor);
      let flattenedMinorsMap = [].concat(...minors);
      let overall = await users.filter(user => user.role === type);
      let thisWeekData =
        getByDate(overall, "week").length +
        getByDate(flattenedMinorsMap, "week").length;
      let thisMonthData =
        getByDate(overall, "month").length +
        getByDate(flattenedMinorsMap, "month").length;
      return {
        overall: overall.length + flattenedMinorsMap.length,
        thisWeekData,
        thisMonthData
      };
    } else {
      return {
        overall: 0,
        thisWeekData: 0,
        thisMonthData: 0
      };
    }
  };

  const getCHWStatsPatients = async (users, chw) => {
    let overall = await users.filter(user => {
      return (
        user.role === roleNames.PATIENT &&
        user.onBoardedBy &&
        user.onBoardedBy._id === chw._id
      );
    });
    let minors = await overall
      .map(user => user.minors)
      .filter(minor => minor.length > 0);
    let flattenedMinorsMap = [].concat(...minors);
    let thisMonthData =
      getByDate(overall, "month").length +
      getByDate(flattenedMinorsMap, "month").length;

    let thisWeekData =
      getByDate(overall, "week").length +
      getByDate(flattenedMinorsMap, "week").length;
    return {
      overall: overall.length + flattenedMinorsMap.length,
      thisWeekData,
      thisMonthData
    };
  };

  const getCHWStatsPractitioners = async (users, chw) => {
    if (users.length > 0) {
      let overall = await users.filter(user => {
        return (
          user.role === roleNames.PRACTITIONER &&
          user.onBoardedBy._id === chw._id
        );
      });
      return {
        overall: overall.length,
        thisWeekData: getByDate(overall, "week").length,
        thisMonthData: getByDate(overall, "month").length
      };
    } else {
      return {
        overall: 0,
        thisWeekData: 0,
        thisMonthData: 0,
        ratings: 0,
        earnings: 0
      };
    }
  };

  const getCHWDataResult = async (data, address) => {
    if (data.length > 0) {
      let overall = await data.filter(
        interaction => interaction.chw.publicAddress === address
      );
      return {
        overall: overall.length,
        thisWeekData: getByDate(overall, "week").length,
        thisMonthData: getByDate(overall, "month").length,
        ratings: 0,
        earnings: Number(
          overall.reduce((acc, curVal) => acc + curVal.rewards[0].chwReward, 0)
        ).toFixed(5)
      };
    } else {
      return {
        overall: 0,
        thisWeekData: 0,
        thisMonthData: 0,
        ratings: 0,
        earnings: 0
      };
    }
  };

  const getPatientData = async (data, address) => {
    if (data.length > 0) {
      let overall = await data.filter(
        interaction =>
          interaction.patient !== null &&
          interaction.patient.publicAddress === address
      );
      return {
        overall: overall.length,
        thisWeekData: getByDate(overall, "week").length,
        thisMonthData: getByDate(overall, "month").length,
        ratings: 0,
        earnings: Number(
          overall.reduce(
            (acc, curVal) => acc + curVal.rewards[0].patientReward,
            0
          )
        ).toFixed(5)
      };
    } else {
      return {
        overall: 0,
        thisWeekData: 0,
        thisMonthData: 0,
        ratings: 0,
        earnings: 0
      };
    }
  };

  const getPractitionerData = async (data, address) => {
    if (data.length > 0) {
      let overall = await data.filter(
        interaction => interaction.practitioner.publicAddress === address
      );

      let rate = overall.map(interaction =>
        typeof interaction.serviceRatings[0] !== "undefined"
          ? Object.values(interaction.serviceRatings[0]).reduce(
              (acc, curVal) => acc + curVal,
              0
            )
          : 0
      );
      return {
        overall: overall.length,
        thisWeekData: getByDate(overall, "week").length,
        thisMonthData: getByDate(overall, "month").length,
        ratings: parseFloat(
          rate.reduce((acc, curVal) => acc + curVal, 0) / rate.length / 0.3
        ).toFixed(2),
        earnings: Number(
          overall.reduce(
            (acc, curVal) => acc + curVal.rewards[0].practitionerReward,
            0
          )
        ).toFixed(5)
      };
    } else {
      return {
        overall: 0,
        thisWeekData: 0,
        thisMonthData: 0,
        ratings: 0,
        earnings: 0
      };
    }
  };

  const getByDate = (data, type) => {
    return data.filter(obj => moment(obj.createdDate).isSame(new Date(), type));
  };

  const getCHWData = async (data, address = null) => {
    if (data.length > 0) {
      if (address) {
        let myInteractions = data.filter(
          interaction => interaction.chw.publicAddress === address
        );
        return {
          overall: Number(
            myInteractions.reduce(
              (acc, curVal) => acc + curVal.rewards[0].chwReward,
              0
            )
          ).toFixed(5),
          thisWeekData: getByDate(myInteractions, "week").length,
          thisMonthData: getByDate(myInteractions, "month").length
        };
      } else {
        return {
          overall: data.length,
          thisWeekData: getByDate(data, "week").length,
          thisMonthData: getByDate(data, "month").length,
          ratings: 0
        };
      }
    } else {
      return {
        overall: 0,
        thisWeekData: 0,
        thisMonthData: 0,
        ratings: 0
      };
    }
  };

  return [{ users, interactions, dashboard }, fetchData];
};

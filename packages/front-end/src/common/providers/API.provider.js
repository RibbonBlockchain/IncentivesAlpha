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
            patients: await getCHWStats(listUsers, roleNames.PATIENT, user),
            practitioners: await getCHWStats(
              listUsers,
              roleNames.PATIENT,
              user
            ),
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
    let thisWeekData = [];
    let thisMonthData = [];
    if (users.length > 0) {
      let overall = await users
        .filter(user => user.role === type)
        .map(user => {
          if (moment(user.createdDate).isSame(new Date(), "week")) {
            thisWeekData.push(user);
          } else if (moment(user.createdDate).isSame(new Date(), "month")) {
            thisMonthData.push(user);
          }
          return user;
        });
      return {
        overall: overall.length,
        thisWeekData: thisWeekData.length,
        thisMonthData: thisMonthData.length
      };
    } else {
      return {
        overall: 0,
        thisWeekData: 0,
        thisMonthData: 0
      };
    }
  };

  const getCHWStats = async (users, type, user) => {
    let thisWeekData = [];
    let thisMonthData = [];
    if (users.length > 0) {
      let overall = await users
        .filter(user => user.role === type && user.onBoardedBy === user._id)
        .map(user => {
          if (moment(user.createdDate).isSame(new Date(), "week")) {
            thisWeekData.push(user);
          } else if (moment(user.createdDate).isSame(new Date(), "month")) {
            thisMonthData.push(user);
          }
          return user;
        });
      return {
        overall: overall.length,
        thisWeekData: thisWeekData.length,
        thisMonthData: thisMonthData.length
      };
    } else {
      return {
        overall: 0,
        thisWeekData: 0,
        thisMonthData: 0
      };
    }
  };

  const getCHWDataResult = async (data, address) => {
    let thisWeekData = [];
    let thisMonthData = [];
    if (data.length > 0) {
      let overall = await data
        .filter(interaction => interaction.chw.publicAddress === address)
        .map(interaction => {
          if (moment(interaction.createdDate).isSame(new Date(), "week")) {
            thisWeekData.push(interaction);
          } else if (
            moment(interaction.createdDate).isSame(new Date(), "month")
          ) {
            thisMonthData.push(interaction);
          }
          return interaction;
        });
      return {
        overall: overall.length,
        thisWeekData: thisWeekData.length,
        thisMonthData: thisMonthData.length,
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
    let thisWeekData = [];
    let thisMonthData = [];
    if (data.length > 0) {
      let overall = await data
        .filter(interaction => interaction.patient.publicAddress === address)
        .map(interaction => {
          if (moment(interaction.createdDate).isSame(new Date(), "week")) {
            thisWeekData.push(interaction);
          } else if (
            moment(interaction.createdDate).isSame(new Date(), "month")
          ) {
            thisMonthData.push(interaction);
          }
          return interaction;
        });
      return {
        overall: overall.length,
        thisWeekData: thisWeekData.length,
        thisMonthData: thisMonthData.length,
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
    let thisWeekData = [];
    let thisMonthData = [];
    if (data.length > 0) {
      let overall = await data
        .filter(
          interaction => interaction.practitioner.publicAddress === address
        )
        .map(interaction => {
          if (moment(interaction.createdDate).isSame(new Date(), "week")) {
            thisWeekData.push(interaction);
          } else if (
            moment(interaction.createdDate).isSame(new Date(), "month")
          ) {
            thisMonthData.push(interaction);
          }
          return interaction;
        });
      return {
        overall: overall.length,
        thisWeekData: thisWeekData.length,
        thisMonthData: thisMonthData.length,
        ratings: 0,
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

  const getCHWData = async (data, address = null) => {
    let thisWeekData = [];
    let thisMonthData = [];
    if (data.length > 0) {
      if (address) {
        let overall = data
          .filter(interaction => interaction.chw.publicAddress === address)
          .map(interaction => {
            if (moment(interaction.createdDate).isSame(new Date(), "week")) {
              thisWeekData.push(interaction);
            } else if (
              moment(interaction.createdDate).isSame(new Date(), "month")
            ) {
              thisMonthData.push(interaction);
            }
            return interaction;
          });
        return {
          overall: Number(
            overall.reduce(
              (acc, curVal) => acc + curVal.rewards[0].chwReward,
              0
            )
          ).toFixed(5),
          thisWeekData: thisWeekData.length,
          thisMonthData: thisMonthData.length
        };
      } else {
        let overall = await data.map(interactions => {
          if (moment(interactions.createdDate).isSame(new Date(), "week")) {
            thisWeekData.push(interactions);
          } else if (
            moment(interactions.createdDate).isSame(new Date(), "month")
          ) {
            thisMonthData.push(interactions);
          }
          return interactions;
        });
        return {
          overall: overall.length,
          thisWeekData: thisWeekData.length,
          thisMonthData: thisMonthData.length,
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

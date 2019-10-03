import { roleNames } from "../../common/constants/roles";

export const isSuperUser = role => {
  return role === roleNames.SUPER_ADMIN;
};

export const isCHW = role => {
  return role === roleNames.COMMUNITY_HEALTH_WORKER;
};

export const isPractitioner = role => {
  return role === roleNames.PRACTITIONER;
};

export const isPatient = role => {
  return role === roleNames.PATIENT;
};

import { roles } from "../../common/constants/roles";

export const isSuperUser = role => {
  return role === roles.SUPER_ADMIN;
};

export const isCHW = role => {
  return role === roles.COMMUNITY_HEALTH_WORKER;
};

export const isPractitioner = role => {
  return role === roles.PRACTITIONER;
};

export const isPatient = role => {
  return role === roles.PATIENT;
};

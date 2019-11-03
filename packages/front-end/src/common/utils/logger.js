import LogAPI from "../services/api/log.api";

export const getLogsByUser = async address => {
  let logAPI = new LogAPI();
  try {
    return await logAPI.listLogsByUser(address);
  } catch (error) {
    return error;
  }
};

export const createLog = async data => {
  let logAPI = new LogAPI();
  try {
    return await logAPI.createLogs(data);
  } catch (error) {
    return error;
  }
};

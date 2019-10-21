import LogAPI from "../api/log.api";

export const waitForConfirmation = async (provider, tx) => {
  let logAPI = new LogAPI();
  try {
    let result = await tx.wait(1);
    let data = {
      txn_address: result.from,
      txn_hash: result.transactionHash,
      txn_date: new Date(),
      txn_amount: result,
      status: result.status
    };
    logAPI.createLogs(data);
    return result;
  } catch (error) {
    return error;
  }
};

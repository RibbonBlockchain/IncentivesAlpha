import BlockchainService from "./index";

const TRANSACTION_STATUSES = {
  Failed: 0,
  Successful: 1,
  Pending: 2
};

export const getTxStatus = async txHash => {
  let blockchainService = new BlockchainService();
  let { provider } = await blockchainService.getInstance();
  if (!txHash) {
    return TRANSACTION_STATUSES.Successful;
  }
  const txReceipt = await provider.getTransactionReceipt(txHash);
  if (txReceipt) {
    return txReceipt.status
      ? TRANSACTION_STATUSES.Successful
      : TRANSACTION_STATUSES.Failed;
  }

  return TRANSACTION_STATUSES.Pending;
};

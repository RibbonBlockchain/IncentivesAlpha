import BlockchainService from "./index";

const TRANSACTION_STATUSES = {
  Failed: 0,
  Successful: 1,
  Pending: 2
};

const waitOneMoreBlock = async function(prevBlockNumber, provider) {
  return new Promise(resolve => {
    setTimeout(async () => {
      const blockNumber = await provider.getBlockNumber();
      if (prevBlockNumber === blockNumber) {
        return waitOneMoreBlock(prevBlockNumber);
      }
      resolve();
    }, 30000);
  });
};

export const getTxStatus = async txHash => {
  let blockchainService = new BlockchainService();
  let { provider } = await blockchainService.getInstance();
  if (!txHash) {
    return TRANSACTION_STATUSES.Successful;
  }
  const txReceipt = await provider.getTransactionReceipt(txHash);
  if (txReceipt) {
    await waitOneMoreBlock(txReceipt.blockNumber, provider);

    return txReceipt.status
      ? TRANSACTION_STATUSES.Successful
      : TRANSACTION_STATUSES.Failed;
  }

  return TRANSACTION_STATUSES.Pending;
};

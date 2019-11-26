import Web3 from "web3";
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

export const watchTransfers = () => {
  const web3 = new Web3(
    new Web3.providers.WebsocketProvider("wss://sokol-ws.poa.network/ws")
  );

  const subscription = web3.eth.subscribe("pendingTransactions");

  subscription
    .subscribe((error, result) => {
      if (error) return { error };
    })
    .on("data", async txHash => {
      try {
        const web3Http = new Web3("https://poa.infura.io");

        const tx = await web3Http.eth.getTransaction(txHash);
        confirmTx(tx);

        subscription.unsubscribe();
      } catch (error) {
        console.log(error);
      }
    });
};

export const confirmTx = (txHash, confirmations = 10) => {
  setTimeout(async () => {
    // Get current number of confirmations and compare it with sought-for value
    const trxConfirmations = await getConfirmations(txHash);

    console.log(
      "Transaction with hash " +
        txHash +
        " has " +
        trxConfirmations +
        " confirmation(s)"
    );

    if (trxConfirmations >= confirmations) {
      // Handle confirmation event according to your business logic

      console.log(
        "Transaction with hash " + txHash + " has been successfully confirmed"
      );

      return;
    }
    // Recursive call
    return confirmTx(txHash, confirmations);
  }, 30 * 1000);
};

async function getConfirmations(txHash) {
  try {
    // Instantiate web3 with HttpProvider
    const web3 = new Web3("https://poa.infura.io");

    // Get transaction details
    const trx = await web3.eth.getTransaction(txHash);

    // Get current block number
    const currentBlock = await web3.eth.getBlockNumber();

    // When transaction is unconfirmed, its block number is null.
    // In this case we return 0 as number of confirmations
    return trx.blockNumber === null ? 0 : currentBlock - trx.blockNumber;
  } catch (error) {
    console.log(error);
  }
}

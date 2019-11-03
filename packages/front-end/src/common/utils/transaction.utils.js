const COOKIE_NAME = "TRANSACTION_STATUS_COOKIE";

export const TYPE_NONE = 0;
export const TYPE_BLOCKCHAIN_SUBMISSION = 1;
export const TYPE_DATABASE_SUBMISSION = 2;

class TransactionStatus {
  constructor() {
    this.dappId = ""; // responsible for background transaction check
    this.dappTx = ""; // responsible for background transaction check
    this.type = TYPE_NONE;
    this.progress = false;
    this.message = "";
    this.published = false;
    this.publishedEmpty = false;
    this.failed = false;
  }

  persistTransactionData() {
    localStorage.setItem(COOKIE_NAME, JSON.stringify(this));
  }

  setTransactionInfo(tx) {
    this.dappTx = tx;
    this.persistTransactionData();
  }

  setProgress(progress) {
    this.progress = progress;
    this.published = false;
    this.publishedEmpty = false;
    this.failed = false;
    this.persistTransactionData();
  }

  setPublished(published, message) {
    this.progress = false;
    this.published = published;
    this.message = message;
    this.publishedEmpty = false;
    this.failed = false;
    this.persistTransactionData();
  }

  setFailed(failed) {
    this.progress = false;
    this.published = false;
    this.publishedEmpty = false;
    this.failed = failed;
    this.persistTransactionData();
  }

  setPublishedEmpty(published) {
    this.progress = false;
    this.published = false;
    this.publishedEmpty = published;
    this.failed = false;
    this.persistTransactionData();
  }

  setType(type) {
    this.type = type;
    this.persistTransactionData();
  }
}

const getTransactionData = () => {
  return localStorage.getItem(COOKIE_NAME);
};

export const transactionStatusFetchedInstance = () => {
  const data = getTransactionData();
  let transactionStatus = new TransactionStatus();
  if (data !== null)
    transactionStatus = Object.assign(transactionStatus, JSON.parse(data));
  return transactionStatus;
};

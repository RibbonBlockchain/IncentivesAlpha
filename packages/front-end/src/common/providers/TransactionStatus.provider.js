import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback
} from "react";
import { getTxStatus } from "../services/blockchain/utils";
const TransactionStatusContext = createContext();
const useTransactionStatusContext = () => useContext(TransactionStatusContext);

const initialState = () => ({
  dappTx: null,
  progress: false,
  published: false,
  failed: false
});

const UPDATE = "tx/UPDATE";

const reducer = (state, { type, payload }) => {
  switch (type) {
    case UPDATE:
      return {
        ...state,
        ...payload
      };
  }
};

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const update = useCallback(payload => {
    dispatch({
      type: UPDATE,
      payload
    });
  });
  return (
    <TransactionStatusContext.Provider
      value={useMemo(() => [state, { update }], [state, update])}
    >
      {children}
    </TransactionStatusContext.Provider>
  );
}

export const useTransactionStatus = () => {
  const [state, { update }] = useTransactionStatusContext();

  const closeTransactionStatus = async () => {
    update({
      dappTx: "",
      progress: false,
      published: false,
      failed: false
    });
  };

  const checkTransactionStatus = async tx => {
    console.log(tx);
    if (tx === undefined) {
      console.log("Tx is undefined");
      update({
        dappTx: tx,
        progress: false,
        message: "",
        published: false,
        failed: true
      });
      return;
    } else {
      let status = 1;

      try {
        update({
          dappTx: tx,
          progress: true,
          message: "",
          published: false,
          failed: false
        });
        status = await getTxStatus(tx);
        switch (status) {
          case 0:
            update({
              dappTx: tx,
              progress: false,
              published: false,
              failed: true
            });
            break;
          default:
          case 1:
            update({
              dappTx: tx,
              progress: false,
              published: true,
              failed: false
            });
            break;
          case 2:
            update({
              dappTx: tx,
              progress: true,
              published: false,
              failed: false
            });
            checkTransactionStatus(tx);
            break;
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return [state, checkTransactionStatus, closeTransactionStatus];
};

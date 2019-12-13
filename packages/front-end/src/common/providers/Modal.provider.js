import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback
} from "react";

const ModalContext = createContext();

const useModalContext = () => useContext(ModalContext);

const initialState = () => ({
  isVisible: false,
  message: null,
  modal: null,
  data: {}
});

const TOGGLE_ALERT = "alert/TOGGLE_ALERT";

const reducer = (state, { type, payload }) => {
  const { message, isVisible, modal, data } = payload;
  switch (type) {
    case TOGGLE_ALERT:
      return {
        ...state,
        isVisible,
        message,
        modal,
        data
      };
    default: {
      throw new Error(`Unknown action type ${type}`);
    }
  }
};

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const update = useCallback(payload => {
    dispatch({
      type: TOGGLE_ALERT,
      payload
    });
  }, []);

  return (
    <ModalContext.Provider
      value={useMemo(() => [state, { update }], [state, update])}
    >
      {children}
    </ModalContext.Provider>
  );
}

export const useAlert = () => {
  const [state, { update }] = useModalContext();

  const toggle = ({ isVisible, message }) =>
    update({ isVisible, message, data: state.data, modal: state.modal });

  return [state, toggle];
};

export const useModal = () => {
  const [state, { update }] = useModalContext();

  const toggleModal = ({ isVisible, data, modal }) => {
    update({ isVisible, modal, data, message: undefined });
  };
  return [state, toggleModal];
};

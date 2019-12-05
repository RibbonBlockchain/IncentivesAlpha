import React, { useState } from "react";
import QrReader from "react-qr-reader";
import useForm from "react-hook-form";
import { sendTokens } from "../Dashboard/dashboard.utils";
import { useModal, useAlert } from "../../common/providers/Modal.provider";
import { useApp } from "../../common/providers/App.provider";
import Modal from "../../common/components/Modal";
import Button from "../../common/components/Button";
import styles from "./Send.module.scss";
import { useTransactionStatus } from "../../common/providers/TransactionStatus.provider";

export default function Send() {
  const [{ modal, isVisible }, toggleModal] = useModal();
  const [, toggle] = useAlert();
  const [walletAddress, setWalletAddress] = useState("");
  const [openQR, setOpenQR] = useState(false);
  const [{ currency }] = useApp();
  const { handleSubmit, register, errors, formState } = useForm({
    mode: "onChange"
  });
  const [, checkTransactionStatus] = useTransactionStatus();

  async function onSubmit(values, e) {
    let data = {
      receipient: walletAddress,
      amount: values.amount.toString(),
      message: values.message
    };
    let result = await sendTokens(data);
    if (result.error) {
      toggle({
        isVisible: true,
        message: result.error,
        data: {}
      });
    } else {
      await checkTransactionStatus(result);
      toggleModal({
        isVisible: false,
        modal: ""
      });
      e.target.reset();
    }
  }

  function handleScan(data) {
    console.log("Data ", data);
    if (data !== null) {
      let walletAddress = data.split(":")[1];
      console.log(walletAddress);
      setWalletAddress(walletAddress);
      setOpenQR(false);
    }
  }

  function handleError(error) {
    console.log("Errr");
  }

  return (
    <Modal
      visible={isVisible && modal === "send"}
      windowClassName={styles.modalWindow}
    >
      {!openQR && (
        <div className={styles.cnt}>
          <h4>Send</h4>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles.modalFormWindow}
          >
            <div className={styles.actions}>
              <Button
                text="Capture Address"
                classNames={[styles.button, styles.button_primary].join(" ")}
                onClick={() => setOpenQR(true)}
                button="button"
              ></Button>
            </div>
            <div className={styles.layout__item}>
              <div className={[styles.input].join(" ")}>
                <label htmlFor="receipient">Receipient Address</label>
                <input
                  className={[styles.form_input].join(" ")}
                  placeholder="0x0..."
                  value={walletAddress}
                  name="publicAddress"
                  type="text"
                  onChange={e => setWalletAddress(e.target.value)}
                />
                <small> {errors.receipient && errors.receipient.message}</small>
              </div>
              <div className={[styles.input].join(" ")}>
                <label htmlFor="amount">Amount in ({currency})</label>
                <input
                  className={[styles.form_input].join(" ")}
                  placeholder="amount"
                  name="amount"
                  type="number"
                  step={0.0001}
                  ref={register({
                    required: "Amount is required",
                    pattern: {}
                  })}
                />
                <small> {errors.amount && errors.amount.message}</small>
              </div>
            </div>
            <div className={styles.layout__item}>
              <div className={[styles.input].join(" ")}>
                <label htmlFor="message">Message</label>
                <textarea
                  className={[styles.form_input].join(" ")}
                  placeholder="message (optional)"
                  name="message"
                  ref={register}
                />
                <small> {errors.message && errors.message.message}</small>
              </div>
            </div>
            <div className={styles.actions}>
              <Button
                type="button"
                text={"Cancel"}
                classNames={[styles.button].join(" ")}
                onClick={() =>
                  toggleModal({ isVisible: false, modal: "", data: null })
                }
              ></Button>
              <Button
                text="Send"
                classNames={[styles.button, styles.button_primary].join(" ")}
                disabled={!formState.isValid}
                button="submit"
              ></Button>
            </div>
          </form>
        </div>
      )}
      {openQR && (
        <QrReader
          delay={1000}
          onError={handleError}
          onScan={handleScan}
          style={{ width: "100%" }}
          resolution={1200}
        />
      )}
    </Modal>
  );
}

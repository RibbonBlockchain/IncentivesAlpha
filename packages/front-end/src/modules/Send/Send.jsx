import React from "react";
import QRScanner from "qr-code-scanner";
import { ethers } from "ethers";
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
  const [{ currency }] = useApp();
  const {
    handleSubmit,
    register,
    errors,
    formState,
    setValue,
    triggerValidation
  } = useForm({
    mode: "onChange"
  });
  const [, checkTransactionStatus] = useTransactionStatus();

  async function onSubmit(values, e) {
    let data = {
      receipient: values.receipient,
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

  function captureAddressFromQRCodeDisplay() {
    try {
      QRScanner.initiate({
        onResult: address => {
          let walletAddress = address.split(":")[1];
          if (ethers.utils.getAddress(walletAddress)) {
            setValue("receipient", walletAddress);
            triggerValidation({ name: "receipient", value: walletAddress });
          } else {
            toggle({
              isVisible: true,
              message: `Address ${address} does not match checksum`,
              data: {}
            });
          }
        },
        timeout: 100000
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Modal
      visible={isVisible && modal === "send"}
      windowClassName={styles.modalWindow}
    >
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
              onClick={captureAddressFromQRCodeDisplay}
              button="button"
            ></Button>
          </div>
          <div className={styles.layout__item}>
            <div className={[styles.input].join(" ")}>
              <label htmlFor="receipient">Receipient Address</label>
              <input
                className={[styles.form_input].join(" ")}
                placeholder="receipient"
                name="receipient"
                type="text"
                ref={register({
                  required: "Receipient Address is required",
                  pattern: {
                    value: /^0x[a-fA-F0-9]{40}$/i,
                    message: "invalid wallet address"
                  }
                })}
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
    </Modal>
  );
}

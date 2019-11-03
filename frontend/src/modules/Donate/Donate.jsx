import React, { useState } from "react";
import useForm from "react-hook-form";
import { makeDonation } from "../Dashboard/dashboard.utils";
import { useModal, useAlert } from "../../common/providers/Modal.provider";
import Modal from "../../common/components/Modal";
import Button from "../../common/components/Button";
import styles from "./Donate.module.scss";
import { useTransactionStatus } from "../../common/providers/TransactionStatus.provider";

export default function DonationModal() {
  const [{ modal, isVisible }, toggleModal] = useModal();
  const [{}, toggle] = useAlert();
  const { handleSubmit, register, errors, formState } = useForm({
    mode: "onChange"
  });
  const [, checkTransactionStatus] = useTransactionStatus();
  const [loading, setLoading] = useState(false);

  async function onSubmit(values, e) {
    let data = {
      value: Number(values.amount),
      message: values.message
    };
    setLoading(true);
    let result = await makeDonation(data);
    if (result.error) {
      setLoading(false);
      toggle({
        isVisible: true,
        message: result.error
      });
    } else {
      await checkTransactionStatus(result);
      setLoading(false);
      e.target.reset();
      closeModal();
    }
  }

  function closeModal() {
    toggleModal({ isVisible: false, modal: "", data: null });
  }
  return (
    <Modal
      visible={isVisible && modal === "donate"}
      windowClassName={styles.modalWindow}
      onClickClose={closeModal}
    >
      <div className={styles.cnt}>
        <h4>Make Donation</h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.modalFormWindow}
        >
          <div className={styles.layout__item}>
            <div className={[styles.input].join(" ")}>
              <label htmlFor="amount">Amount in (eth)</label>
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
              onClick={closeModal}
            ></Button>
            <Button
              text="Donate"
              classNames={[styles.button, styles.button_primary].join(" ")}
              disabled={!formState.isValid || loading}
              button="submit"
            ></Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

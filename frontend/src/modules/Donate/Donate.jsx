import React from "react";
import useForm from "react-hook-form";
import { makeDonation } from "../Dashboard/dashboard.utils";
import { useModal, useAlert } from "../../common/providers/Modal.provider";
import Modal from "../../common/components/Modal";
import Button from "../../common/components/Button";
import styles from "./Donate.module.scss";

export default function DonationModal() {
  const [{ modal, isVisible }, toggleModal] = useModal();
  const [{}, toggle] = useAlert();
  const { handleSubmit, register, errors, formState } = useForm({
    mode: "onChange"
  });

  async function onSubmit(values, e) {
    let data = {
      value: Number(values.amount),
      message: values.message
    };
    let result = await makeDonation(data);
    toggle({
      isVisible: true,
      message: result.message,
      data: {}
    });

    e.target.reset();
  }
  return (
    <Modal
      visible={isVisible && modal === "donate"}
      windowClassName={styles.modalWindow}
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
              onClick={() =>
                toggleModal({ isVisible: false, modal: "", data: null })
              }
            ></Button>
            <Button
              text="Donate"
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

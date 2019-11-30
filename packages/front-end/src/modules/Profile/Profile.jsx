import React, { useState } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import useForm from "react-hook-form";
import styles from "./Profile.module.scss";
import Card from "../../common/components/Card";
import { updateUserProfile } from "./profile.utils";
import Button from "../../common/components/Button";
import { useAlert } from "../../common/providers/Modal.provider";
import { useWeb3 } from "../../common/providers/Web3.provider";

export default function Profile() {
  const { handleSubmit, register, errors, formState } = useForm({
    mode: "onChange"
  });
  const [phoneNumber, setPhoneNumber] = useState({
    value: null,
    isValid: false
  });
  const [, toggle] = useAlert();
  const [{ address, user }] = useWeb3();

  async function onSubmit(values, e) {
    let data = {
      ...values,
      address
    };
    let user = await updateUserProfile(data);
    if (user.error) {
      toggle({
        isVisible: true,
        message: user.error,
        data: {}
      });
    } else {
      toggle({
        isVisible: true,
        message: `Your profile has been successfully saved`,
        data: {}
      });
    }
  }

  return (
    <>
      <h2>Profile</h2>
      <div className={styles.layout__item__full}>
        <Card classNames={[styles.card].join(" ")}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles.form}
            autoComplete="off"
          >
            <div className={[styles.layout__item__full].join(" ")}>
              <div className={[styles.input].join(" ")}>
                <label htmlFor="firstName">First Name</label>
                <input
                  className={[styles.form_input].join(" ")}
                  placeholder="first name"
                  name="firstName"
                  type="text"
                  defaultValue={user.firstname}
                  ref={register({
                    pattern: {
                      value: /^[a-zA-Z ]+$/i,
                      message: "invalid first name"
                    }
                  })}
                />
                <small> {errors.firstName && errors.firstName.message}</small>
              </div>
            </div>
            <div className={[styles.layout__item].join(" ")}>
              <div className={[styles.input].join(" ")}>
                <label htmlFor="lastName">Last Name</label>
                <input
                  className={[styles.form_input].join(" ")}
                  placeholder="last name"
                  name="lastName"
                  type="text"
                  defaultValue={user.lastname}
                  ref={register({
                    pattern: {
                      value: /^[a-zA-Z ]+$/i,
                      message: "invalid last name"
                    }
                  })}
                />
                <small> {errors.lastName && errors.lastName.message}</small>
              </div>
            </div>
            <div className={styles.layout}>
              <div className={styles.layout__item}>
                <div className={[styles.input].join(" ")}>
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <PhoneInput
                    className={[styles.form_input].join(" ")}
                    placeholder="phone number"
                    value={user.phoneNumber}
                    onChange={value => {
                      setPhoneNumber({
                        isValid: isValidPhoneNumber(value),
                        value
                      });
                    }}
                  />
                  {phoneNumber.value && !phoneNumber.isValid && (
                    <small>invalid phone number</small>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.layout__item}>
              <div className={[styles.input].join(" ")}>
                <label htmlFor="location">House Address</label>
                <textarea
                  name="location"
                  cols="30"
                  rows="3"
                  defaultValue={user.location}
                  placeholder="Your home Address"
                  ref={register}
                ></textarea>
              </div>
            </div>
            <div className={styles.layout__item}>
              <Button
                text="Save Changes"
                classNames={[styles.button, styles.button_primary].join(" ")}
                disabled={!formState.isValid}
              ></Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}

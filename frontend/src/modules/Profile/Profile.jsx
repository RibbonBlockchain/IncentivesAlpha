import React, { useRef } from "react";
import styles from "./Profile.module.scss";
import Card from "../../common/components/Card";
import TextInput from "../../common/components/TextInput";
import Button from "../../common/components/Button";

export default function Profile() {
  let firstNameRef = useRef(null);
  let lastNameRef = useRef(null);
  let emailRef = useRef(null);

  function saveChanges() {}
  return (
    <>
      <h2>Profile</h2>
      <div className={styles.layout__item__full}>
        <Card classNames={[styles.card]}>
          <div className={[styles.layout__item__full].join(" ")}>
            <TextInput
              placeholder="your firstname"
              classNames={styles.form_input}
              inputType="text"
              refs={firstNameRef}
              label="First name"
            />
          </div>
          <div className={[styles.layout__item].join(" ")}>
            <TextInput
              placeholder="your lastname"
              classNames={styles.form_input}
              inputType="text"
              refs={lastNameRef}
              label="Last name"
            />
            <TextInput
              placeholder="email address"
              classNames={styles.form_input}
              inputType="text"
              refs={emailRef}
              label="Email Address"
            />
          </div>
          <div className={styles.layout__item}>
            <Button
              text="Save Changes"
              classNames={[styles.button, styles.button_primary].join(" ")}
              onClick={saveChanges}
            ></Button>
          </div>
        </Card>
      </div>
    </>
  );
}

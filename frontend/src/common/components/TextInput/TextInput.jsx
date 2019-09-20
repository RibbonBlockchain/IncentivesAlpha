import React from "react";

import styles from "./TextInput.module.scss";

function TextInput({ classNames, inputType, placeholder, refs }) {
  return (
    <>
      <input
        className={[styles.form_input, classNames].join(" ")}
        placeholder={placeholder}
        ref={refs}
        type={inputType}
      />
    </>
  );
}

export default TextInput;

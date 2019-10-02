import React from "react";

import styles from "./TextInput.module.scss";

function TextInput({ classNames, inputType, placeholder, refs, label }) {
  return (
    <div className={[styles.input, classNames].join(" ")}>
      {label && <label htmlFor={label}>{label}</label>}
      <input
        className={[styles.form_input].join(" ")}
        placeholder={placeholder}
        ref={refs}
        type={inputType}
      />
    </div>
  );
}

export default TextInput;

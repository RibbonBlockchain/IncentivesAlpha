import React from "react";

import styles from "./TextInput.module.scss";

function TextInput({ classNames, inputType, placeholder, refs, label, name }) {
  return (
    <div className={[styles.input].join(" ")}>
      {label && <label htmlFor={label}>{label}</label>}
      <input
        className={[styles.form_input, classNames].join(" ")}
        placeholder={placeholder}
        ref={refs}
        name={name}
        type={inputType}
      />
    </div>
  );
}

export default TextInput;

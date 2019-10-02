import React from "react";
import ReactImageFallback from "react-image-fallback";
import styles from "./Button.module.scss";

function Button({ classNames, text, image, onClick, altImage, disabled }) {
  return (
    <button
      disabled={disabled}
      className={[styles.button, classNames].join(" ")}
      onClick={onClick}
    >
      {image && (
        <ReactImageFallback
          src={image}
          fallbackImage={image}
          initialImage={image}
          alt={altImage}
          className={styles.buttonImage}
        />
      )}
      <span>{text}</span>
    </button>
  );
}

export default Button;

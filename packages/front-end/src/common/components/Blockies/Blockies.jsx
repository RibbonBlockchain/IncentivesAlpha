import React from "react";
import createIcon from "./util";

const Blockies = ({ address, imageSize = 42, className }) => {
  let imgURL = createIcon({
    seed: address.toLowerCase(),
    size: 8,
    scale: 5
  }).toDataURL();

  return (
    <span
      className={className}
      style={{
        backgroundImage: `url(${imgURL})`,
        backgroundSize: `cover`,
        width: `${imageSize}px`,
        height: `${imageSize}px`,
        display: `inline-block`
      }}
    />
  );
};

export default Blockies;

export const formatAddress = address => {
  let pre = address.slice(0, 12);
  let post = address.slice(address.length - 4);

  return `${pre}...${post}`;
};

export const toHex = str => {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }
  return result;
};

export const fromHex = hex => {
  let string = "";
  for (let i = 0; i < hex.length; i += 2) {
    string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return string;
};

export const formatLink = link => {
  return (
    link
      .substr(5)
      .charAt(0)
      .toUpperCase() + link.substr(6).replace("-", " ")
  );
};

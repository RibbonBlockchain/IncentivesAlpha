export const formatAddress = address => {
  let pre = address.toLowerCase().slice(0, 12);
  let post = address.toLowerCase().slice(14, 18);

  return `${pre}...${post}`;
};

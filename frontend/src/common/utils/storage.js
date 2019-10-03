export const setItem = (key, item) => {
  return localStorage.setItem(key, item);
};

export const getItem = key => {
  return localStorage.getItem(key);
};

export const removeItem = key => {
  return localStorage.removeItem(key);
};

export const clear = () => {
  return localStorage.clear();
};

export const waitForConfirmation = async (provider, tx) => {
  try {
    return await tx.wait(1);
  } catch (error) {
    return error;
  }
};

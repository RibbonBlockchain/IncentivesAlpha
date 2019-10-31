export const waitForConfirmation = async tx => {
  try {
    let wait = await tx.wait(1);
    return wait;
  } catch (error) {
    return error;
  }
};

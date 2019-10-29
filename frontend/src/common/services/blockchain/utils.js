export const waitForConfirmation = async (provider, signer, tx) => {
  try {
    let gas = await provider.estimateGas(tx);
    tx.gasLimit = gas;
    console.log(gas);
    let signer = await signer.sendTransaction(tx);
    console.log(signer);
  } catch (error) {
    return error;
  }
};

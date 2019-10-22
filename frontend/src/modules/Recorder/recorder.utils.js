import VaultContract from "../../common/services/blockchain/apps/vault";
import InteractionAPI from "../../common/services/api/interaction.api";

export const recordInteraction = async data => {
  let vaultContract = new VaultContract();
  let interactionAPI = new InteractionAPI();
  let { patient, practitioner, chw } = data;

  let payoutInformation = {
    patient: patient.address,
    practitioner: practitioner.address,
    chw: chw.address
  };

  try {
    let tx = await vaultContract.payout(payoutInformation);
    if (tx.transactionHash) {
      let interaction = await interactionAPI.createInteraction(data);
      if (interaction.error) {
        return {
          error: interaction.error
        };
      } else if (interaction.message.code) {
        return {
          error: interaction.message.code
        };
      } else {
        return {
          interaction
        };
      }
    } else {
      return {
        error: `An error occured. Please try again`
      };
    }
  } catch (error) {
    return {
      error
    };
  }
};

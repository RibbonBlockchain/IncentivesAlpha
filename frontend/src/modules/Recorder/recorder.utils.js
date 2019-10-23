import VaultContract from "../../common/services/blockchain/apps/vault";
import InteractionAPI from "../../common/services/api/interaction.api";

export const recordInteraction = async data => {
  let vaultContract = new VaultContract();
  let interactionAPI = new InteractionAPI();
  let {
    patient,
    practitioner,
    user,
    amount,
    activities,
    prescriptions,
    serviceRatings
  } = data;

  let payoutInformation = {
    patient: patient.value.publicaddress,
    practitioner: practitioner.value.publicaddress,
    chw: user.publicaddress,
    amount
  };

  let rewards = [];

  try {
    let tx = await vaultContract.payout(payoutInformation);
    if (tx.transactionHash) {
      let details = {
        patientId: patient.value._id,
        practitionerId: practitioner.value._id,
        activities,
        prescriptions,
        rewards,
        serviceRatings
      };
      let interaction = await interactionAPI.createInteraction(details);
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

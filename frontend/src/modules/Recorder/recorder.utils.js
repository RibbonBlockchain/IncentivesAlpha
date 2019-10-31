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
    patient: patient.value.publicAddress,
    practitioner: practitioner.value.publicAddress,
    chw: user.publicaddress,
    amount
  };

  try {
    if (amount > 0) {
      let tx = await vaultContract.payout(payoutInformation);
      if (tx.transactionHash) {
        let details = {
          patient: patient.value._id,
          practitioner: practitioner.value._id,
          chw: user._id,
          activities:
            activities.length > 0
              ? activities.map(activity => ({
                  activityId: activity.value
                }))
              : activities,
          prescriptions:
            prescriptions.length > 0
              ? prescriptions.map(prescription => ({
                  prescriptionId: prescription.value
                }))
              : prescriptions,
          rewards: [
            {
              patientReward: amount,
              practitionerReward: amount,
              chwReward: amount
            }
          ],
          serviceRatings
        };
        let interaction = await interactionAPI.createInteraction(details);
        if (interaction._id) {
          return interaction;
        } else {
          if (interaction.message.errors) {
            return {
              error: interaction.message._message
            };
          } else {
            return {
              error: interaction.error
            };
          }
        }
      } else {
        return {
          error: `An error occured. Please try again`
        };
      }
    } else {
      return {
        error: `Please select activities and prescriptions`
      };
    }
  } catch (error) {
    return {
      error
    };
  }
};

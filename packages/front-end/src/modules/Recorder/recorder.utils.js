import VaultContract from "../../common/services/blockchain/apps/vault";
import InteractionAPI from "../../common/services/api/interaction.api";

export const recordInteraction = async data => {
  let vaultContract = new VaultContract();
  let { patient, practitioner, user, amount, serviceRatings } = data;

  let practitionerAmount = Number(amount * 0.15).toFixed(6);
  // ((amount * 0.1 + sumRatings(serviceRatings) / 30) * 0.05 * amount);

  let chwAmount = Number(amount * 0.15).toFixed(6);

  let payoutInformation = {
    patient: patient.value.publicAddress,
    practitioner: practitioner.value.publicAddress,
    chw: user.publicaddress,
    patientAmount: Number(amount).toFixed(6),
    practitionerAmount,
    chwAmount
  };

  try {
    if (amount > 0) {
      let tx = await vaultContract.payout(payoutInformation);
      if (tx.hash) {
        return tx.hash;
      } else {
        console.log(tx);
        return {
          error: tx.code ? tx.message : tx
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

const sumRatings = ratings => {
  return ratings.length > 0
    ? Object.keys(ratings).reduce((acc, value) => acc + ratings[value], 0)
    : 0;
};

export const recordInteractionOnDB = async ({
  patient,
  practitioner,
  user,
  amount,
  activities,
  prescriptions,
  serviceRatings
}) => {
  let interactionAPI = new InteractionAPI();
  let details = {
    patient: patient.value._id,
    practitioner: practitioner.value._id,
    chw: user._id,
    activities:
      activities.length > 0
        ? activities.map(activity => activity.data._id)
        : activities,
    prescriptions:
      prescriptions.length > 0
        ? prescriptions.map(prescription => prescription.value)
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
};

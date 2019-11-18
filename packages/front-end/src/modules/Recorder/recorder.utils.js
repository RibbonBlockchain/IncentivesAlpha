import VaultContract from "../../common/services/blockchain/apps/vault";
import InteractionAPI from "../../common/services/api/interaction.api";

export const recordInteraction = async data => {
  let vaultContract = new VaultContract();
  let {
    patient,
    practitioner,
    user,
    amount,
    serviceRatings
  } = data;

  let practitionerAmount = parseFloat((amount * 0.1 * sumRatings(serviceRatings) / 30 + 0.05 * amount).toFixed(10));

  let chwAmount = parseFloat((amount * 0.15).toFixed(10));

  let payoutInformation = {
    patient: patient.value.publicAddress,
    practitioner: practitioner.value.publicAddress,
    chw: user.publicaddress,
    patientAmount: amount,
    practitionerAmount: practitionerAmount,
    chwAmount: chwAmount
  };

  console.log("payoutInformation:", payoutInformation)

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

const sumRatings = serviceRatings => {
  return typeof serviceRatings !== "undefined" ?
    Object.entries(serviceRatings).reduce((acc, curVal) => acc + curVal[1], 0) :
    0;
};

export const recordInteractionOnDB = async ({
  patient,
  practitioner,
  user,
  amount,
  activities,
  prescriptions,
  serviceRatings,
  txHash
}) => {
  let interactionAPI = new InteractionAPI();
  let practitionerAmount = parseInt(
    (amount * 0.1 + sumRatings(serviceRatings) / 30) * 0.05 * amount
  ).toString();

  let chwAmount = parseInt(amount * 0.15).toString();
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
        practitionerReward: practitionerAmount,
        chwReward: chwAmount
      }
    ],
    transactionLog: {
      txn_hash: txHash,
      txn_amount: practitionerAmount + chwAmount + amount
    },
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
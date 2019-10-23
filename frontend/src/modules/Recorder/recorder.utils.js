import VaultContract from "../../common/services/blockchain/apps/vault";
import InteractionAPI from "../../common/services/api/interaction.api";

export const recordInteraction = async data => {
  let vaultContract = new VaultContract();
  let interactionAPI = new InteractionAPI();
  let {
    patient,
    practitioner,
    user,
    // amount,
    activities,
    prescriptions,
    serviceRatings
  } = data;

  let amount = "0.1";

  let payoutInformation = {
    patient: "0xe0b2CaE02Cd112044b482bb41f67A03446eCB431",
    practitioner: "0x4FE53D30B9baAb8a6E563a515d8468b0Cda54989",
    chw: user.publicaddress,
    patientAmount: amount,
    practitionerAmount: amount,
    chwAmount: amount
  };

  console.log(payoutInformation);

  try {
    let tx = await vaultContract.payout(payoutInformation);
    console.log(tx);
    //     if (tx.transactionHash) {
    //       let details = {
    //         patientId: patient.value._id,
    //         practitionerId: practitioner.value._id,
    //         activities: activities.map(activity => {
    //           return {
    //             activityId: activity.value
    //           };
    //         }),
    //         prescriptions: prescriptions.map(prescription => {
    //           return {
    //             prescriptionId: prescription.value
    //           };
    //         }),
    //         rewards: [
    //           {
    //             patientReward: amount,
    //             practitionerReward: amount,
    //             chwReward: amount
    //           }
    //         ],
    //         serviceRatings
    //       };
    //       let interaction = await interactionAPI.createInteraction(details);
    //       console.log(interaction);
    //       //   if (interaction.error) {
    //       //     return {
    //       //       error: interaction.error
    //       //     };
    //       //   } else if (interaction.message.code) {
    //       //     return {
    //       //       error: interaction.message.code
    //       //     };
    //       //   } else {
    //       //     return {
    //       //       interaction
    //       //     };
    //       //   }
    //     } else {
    //       return {
    //         error: `An error occured. Please try again`
    //       };
    //     }
  } catch (error) {
    return {
      error
    };
  }
};

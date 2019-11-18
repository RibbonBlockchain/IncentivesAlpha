import { Parser } from "json2csv";
import moment from "moment";
import UserAPI from "../../common/services/api/user.api";
import InteractionAPI from "../../common/services/api/interaction.api";
import RegistryContract from "../../common/services/blockchain/apps/registry";
import VaultContract from "../../common/services/blockchain/apps/vault";
import { exportCSVFile } from "../../common/utils/json2csv";
export const loadUsers = async () => {
  let userAPI = new UserAPI();

  let listUsers = await userAPI.listUsers();
  return listUsers.data;
};

export const getRoleCount = (userList, role) => {
  return userList.length > 0
    ? userList
        .map(object => object.role === role)
        .reduce((accumulator, object) => accumulator + object, 0)
    : "0";
};

export const generateReport = async (date, address, options) => {
  let registryContract = new RegistryContract();
  let interactionAPI = new InteractionAPI();
  let fields = [
    {
      label: "Interaction S/N",
      value: row => `${row._id}`,
      default: "NULL"
    },
    {
      label: "Health Worker",
      value: row => `${row.chw.firstName} ${row.chw.lastName}`,
      default: "NULL"
    },
    {
      label: "Patient",
      value: row => `${row.patient.firstName} ${row.patient.lastName}`,
      default: "NULL"
    },
    {
      label: "Practitioner",
      value: row =>
        `${row.practitioner.firstName} ${row.practitioner.lastName}`,
      default: "NULL"
    },
    {
      label: "Date Recorded",
      value: row => `${moment(row.createdDate).format("DD/MM/YYYY")}`,
      default: "NULL"
    },
    {
      label: "Patient Payout",
      value: row =>
        `${row.rewards.map(reward => reward.patientReward).join("")}`,
      default: "NULL"
    },
    {
      label: "Practitioner Payout",
      value: row =>
        `${row.rewards.map(reward => reward.practitionerReward).join("")}`,
      default: "NULL"
    },
    {
      label: "Health Worker Payout",
      value: row => `${row.rewards.map(reward => reward.chwReward).join("")}`,
      default: "NULL"
    },
    {
      label: "Health Services",
      value: row =>
        `${row.serviceRatings.map(rating => rating.health_services).join("")}`,
      default: "NULL"
    },
    {
      label: "Medicines",
      value: row =>
        `${row.serviceRatings.map(rating => rating.medicines).join("")}`,
      default: "NULL"
    },
    {
      label: "Patient Safety",
      value: row =>
        `${row.serviceRatings.map(rating => rating.patient_safety).join("")}`,
      default: "NULL"
    },
    {
      label: "Cleanliness",
      value: row =>
        `${row.serviceRatings.map(rating => rating.cleanliness).join("")}`,
      default: "NULL"
    },
    {
      label: "Staff Attitude",
      value: row =>
        `${row.serviceRatings.map(rating => rating.staff_attitude).join("")}`,
      default: "NULL"
    },
    {
      label: "Waiting time",
      value: row =>
        `${row.serviceRatings.map(rating => rating.waiting_time).join("")}`,
      default: "NULL"
    }
  ];
  let parser = new Parser({ fields });
  let role = await registryContract.getUserRole(address);
  try {
    let data = await interactionAPI.generateReport(
      address,
      {
        to: moment(date.to).format("YYYY-MM-DD"),
        from: moment(date.from).format("YYYY-MM-DD")
      },
      { role }
    );
    if (data.length > 0) {
      let csv = parser.parse(data);
      exportCSVFile(csv, `${new Date().getTime()}`);
      return data;
    } else {
      return {
        error: "Could not generate report for specified dates"
      };
    }
  } catch (error) {
    return {
      error
    };
  }
};

export const generatePrescriptionReport = async (date, address) => {
  let registryContract = new RegistryContract();
  let interactionAPI = new InteractionAPI();
  let fields = [
    {
      label: "Health Worker",
      value: row => `${row.chw.firstName} ${row.chw.lastName}`,
      default: "NULL"
    },
    {
      label: "Patient",
      value: row => `${row.patient.firstName} ${row.patient.lastName}`,
      default: "NULL"
    },
    {
      label: "Practitioner",
      value: row =>
        `${row.practitioner.firstName} ${row.practitioner.lastName}`,
      default: "NULL"
    },
    {
      label: "Prescriptions",
      value: row =>
        `${row.prescriptions
          .map(prescription => prescription.prescriptionTitle)
          .join(", ")}`,
      default: "NULL"
    },
    {
      label: "Date Recorded",
      value: row => `${moment(row.createdDate).format("DD/MM/YYYY")}`,
      default: "NULL"
    }
  ];
  let parser = new Parser({ fields });
  let role = await registryContract.getUserRole(address);
  try {
    let data = await interactionAPI.generateReport(
      address,
      {
        to: moment(date.to).format("YYYY-MM-DD"),
        from: moment(date.from).format("YYYY-MM-DD")
      },
      { role }
    );
    if (data.length > 0) {
      let csv = parser.parse(data);
      exportCSVFile(csv, `${new Date().getTime()}`);
      return data;
    } else {
      return {
        error: "Could not generate report for specified dates"
      };
    }
  } catch (error) {
    return {
      error
    };
  }
};

export const makeDonation = async ({ value, message }) => {
  let vaultContract = new VaultContract();

  let memo = message ? message : "Making donation";

  let tx = await vaultContract.donateFunds(value, memo);
  if (tx.hash) {
    return tx.hash;
  } else {
    return {
      error: tx.stack.split(":")[2]
    };
  }
};

export const sendTokens = async ({ amount, receipient, message }) => {
  let vaultContract = new VaultContract();
  let memo = message ? message : `Sending ${amount} tokens to ${receipient}`;

  let tx = await vaultContract.sendTokens({ amount, receipient });
  if (tx.hash) {
    return tx.hash;
  } else {
    return {
      error: tx.stack.split(":")[2]
    };
  }
};

export const formatActivityOptions = options => {
  return (
    options.length > 0 &&
    options.map(option => ({
      label: option.activityTitle,
      value: option._id,
      data: option
    }))
  );
};

export const formatPrescriptionOptions = options => {
  return (
    options.length > 0 &&
    options.map(option => ({
      label: option.prescriptionTitle,
      value: option._id
    }))
  );
};

export const getByRole = (users, role) => {
  let data = [];
  users.length > 0 &&
    users.map(user => {
      if (user.role === role) {
        data.push({
          label: user.idNumber,
          value: user
        });
      }
    });
  return data;
};

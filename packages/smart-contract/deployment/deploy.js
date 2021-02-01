const etherlime = require("etherlime-lib");
require("dotenv").config();

const { DEPLOYER_PRIVATE_KEY } = process.env;

const AdminABI = require("../build/Admin.json");
const RegistryABI = require("../build/Registry.json");
const VaultABI = require("../build/Vault.json");

const defaultConfigs = {
  gasPrice: 20000000000,
  gasLimit: 4700000
  // etherscanApiKey:
};

const deploy = async (network, secret) => {
  console.log("Running Deployment on network: ", network);
  //set up the deployer
  let networkRPC = "";
  if (network == "local") {
    networkRPC = "http://localhost:8545/";
  }
  if (network == "sokol") {
    networkRPC = "https://sokol.poa.network";
  }

  const deployer = new etherlime.JSONRPCPrivateKeyDeployer(
    DEPLOYER_PRIVATE_KEY,
    networkRPC,
    defaultConfigs
  );

  // const deploy = (...args) => deployer.deployAndVerify(...args);
  const deploy = (...args) => deployer.deploy(...args);

  //deploy the contracts
  const adminDeployed = await deploy(AdminABI);
  const vaultDeployed = await deploy(
    VaultABI,
    false,
    adminDeployed.contract.address
  );
  const registryDeployed = await deploy(
    RegistryABI,
    false,
    vaultDeployed.contract.address,
    adminDeployed.contract.address
  );

  //init the admin
  const initAdminTx = await adminDeployed.init(
    vaultDeployed.contract.address,
    registryDeployed.contract.address
  );
  await adminDeployed.verboseWaitForTransaction(initAdminTx, "Init Admin");

  //init the vault
  const initVaultTx = await vaultDeployed.init(
    registryDeployed.contract.address
  );
  await vaultDeployed.verboseWaitForTransaction(initVaultTx, "Init vault");

  //add users as admins
  let addUser1Tx = await registryDeployed.addUser(
    "0x1b64eb6C911AA4A189ccea856f2cDBFbd750932b",
    1
  ); //issac 1
  await registryDeployed.verboseWaitForTransaction(
    addUser1Tx,
    "Adding admin User 1"
  );

  let addUser2Tx = await registryDeployed.addUser(
    "0x9F819E3C128045151Cd793A7eE7c79aaC63C8064",
    1
  ); //issac 2
  await registryDeployed.verboseWaitForTransaction(
    addUser2Tx,
    "Adding admin User 2"
  );

  let addUser3Tx = await registryDeployed.addUser(
    "0x7d656B1595c40FD19263Ab24a2AE98995063BA52",
    1
  ); //allan
  await registryDeployed.verboseWaitForTransaction(
    addUser3Tx,
    "Adding admin User 3"
  );

  let addUser4Tx = await registryDeployed.addUser(
    "0x52808427D1bF54554ED984716201C0e3F794Bc96",
    1
  ); //gugu
  await registryDeployed.verboseWaitForTransaction(
    addUser4Tx,
    "Adding admin User 4"
  );
};
//
module.exports = {
  deploy
};

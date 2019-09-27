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
  //set up the deployer
  const deployer = new etherlime.JSONRPCPrivateKeyDeployer(
    DEPLOYER_PRIVATE_KEY,
    "http://localhost:8545/",
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
};
module.exports = {
  deploy
};

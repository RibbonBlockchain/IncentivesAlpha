export const config = {
  POA_RPC: process.env.REACT_APP_POA_RPC || "http://127.0.0.1:8545",
  ADMIN_CONTRACT_ADDRESS:
    process.env.REACT_APP_ADMIN_CONTRACT_ADDRESS ||
    "0x57F75D60a108A2B53C7cCEbec26664191476f2C4",
  VAULT_CONTRACT_ADDRESS:
    process.env.REACT_APP_VAULT_CONTRACT_ADDRESS ||
    "0xe37CB89Aa8e8bc1b7065C35bc30b1Db5c63C40BA",
  REGISTRY_CONTRACT_ADDRESS:
    process.env.REACT_APP_REGISTRY_CONTRACT_ADDRESS ||
    "0x96a4cF99592af8bFD11d9bC2491b684f55D17Ad3",
  PRIVATE_KEY:
    process.env.REACT_APP_PRIVATE_KEY ||
    "0x190f12957983e77f3750d8a3529eaa4775abac27f21c30e11cc018f682905dca",

  NETWORK: process.env.REACT_APP_NETWORK || "kovan",
  // Auth
  WALLET_CONNECT:
    process.env.REACT_APP_INFURA_ID || "ad774db213544e6a805541dbd3719d36",
  PORTIS: process.env.REACT_APP_PORTIS_ID || "",
  FORTMATIC: process.env.REACT_APP_FORTMATIC_ID || ""
};

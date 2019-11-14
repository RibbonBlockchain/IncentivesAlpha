export const config = {
  POA_RPC: process.env.REACT_APP_POA_RPC || "https://sokol.poa.network/",
  ADMIN_CONTRACT_ADDRESS:
    process.env.REACT_APP_ADMIN_CONTRACT_ADDRESS ||
    "0x6a107ED419aaF6DdDBB1F5b2d75C10966CD86caA",
  VAULT_CONTRACT_ADDRESS:
    process.env.REACT_APP_VAULT_CONTRACT_ADDRESS ||
    "0xCb0bB361fDCcD3EE16e1c0dF5c72f27b2F584042",
  REGISTRY_CONTRACT_ADDRESS:
    process.env.REACT_APP_REGISTRY_CONTRACT_ADDRESS ||
    "0x67A6E4Eb3BBd2Fd932fdc376670CDa975EA3e423",
  PRIVATE_KEY:
    process.env.REACT_APP_PRIVATE_KEY ||
    "0x190f12957983e77f3750d8a3529eaa4775abac27f21c30e11cc018f682905dca",

  DEFAULT_NETWORK: process.env.REACT_APP_NETWORK || 77,
  // Auth
  API_ENDPOINT:
    process.env.NODE_ENV !== "production"
      ? process.env.REACT_APP_API_ENDPOINT ||
        "https://staging.ribbonblockchain.com:2053/api/v1"
      : process.env.REST_API_URL || "https://staging.ribbonblockchain.com",
  WALLET_CONNECT:
    process.env.REACT_APP_INFURA_ID || "ad774db213544e6a805541dbd3719d36",
  PORTIS:
    process.env.REACT_APP_PORTIS_ID || "01cced9c-be26-4742-84d6-67dbfdce7194",
  FORTMATIC: process.env.REACT_APP_FORTMATIC_ID || "pk_test_B395AD580D9ADEA6"
};

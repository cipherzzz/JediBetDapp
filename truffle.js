require('dotenv').config()
const MNEMONIC = process.env.MNEMONIC_PHRASE;
const INFURA_API_KEY = process.env.MNEMONIC_PHRASE;
const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/"+INFURA_API_KEY),
      network_id: 3
    },
    kovan: {
      provider: new HDWalletProvider(MNEMONIC, "https://kovan.infura.io/"+INFURA_API_KEY),
      network_id: 42
    },
  }
};
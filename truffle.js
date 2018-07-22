var mnemonic = "appear stomach artist ancient order chronic judge close arch sick example oxygen";
var HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "577" // Match any network id
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/fYegUFu9HulgkCPiCTuy"),
      network_id: 3
    },
    kovan: {
      provider: new HDWalletProvider(mnemonic, "https://kovan.infura.io/fYegUFu9HulgkCPiCTuy"),
      network_id: 42
    },
  }
};
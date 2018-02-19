var mnemonic = "suit crane income frame twist remove win panda sick lava item moment";
var HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/fYegUFu9HulgkCPiCTuy"),
      network_id: 3,
      gas: 4000000
    },
    rinkeby: {
      provider: new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/fYegUFu9HulgkCPiCTuy'),
      network_id: '*',
      gas: 4500000,
      gasPrice: 25000000000
    }
  },
  rpc: {
    host: 'localhost',
    post: 8080
  }
};
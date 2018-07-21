var mnemonic = "appear stomach artist ancient order chronic judge close arch sick example oxygen";
var HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  networks: {
    development: {
      provider: new HDWalletProvider(mnemonic, "http://localhost:8545"),
      network_id: 577,
      gas: 2000000,
      gasPrice: 10000000000,
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
require('dotenv').config();
const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic = process.env.MNEMONICS;
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/"+process.env.INFURA_ID)
      },
      network_id: 3
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}
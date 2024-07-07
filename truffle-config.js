require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    sepolia: {
      provider: () => new HDWalletProvider(
        process.env.MNEMONIC,
        `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`
      ),
      network_id: 11155111,  // Sepolia's id
      gas: 4500000,          // Gas limit
      gasPrice: 10000000000  // 10 Gwei
    }
  },
  compilers: {
    solc: {
      version: "0.8.21"  // Fetch exact version from solc-bin (default: truffle's version)
    }
  }
};


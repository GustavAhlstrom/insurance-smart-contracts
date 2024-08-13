require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

// Log the environment variables to ensure they're loaded correctly
console.log("Mnemonic:", process.env.MNEMONIC);
console.log("Infura API Key:", process.env.INFURA_API_KEY);

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    sepolia: {
      provider: () => new HDWalletProvider({
        mnemonic: process.env.MNEMONIC,
        providerOrUrl: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
        pollingInterval: 15000  // Increase polling interval to 8 seconds
      }),
      network_id: 11155111,  // Sepolia's id
      gas: 6721975,          // Gas limit
      gasPrice: 25000000000, // 25 Gwei
      timeoutBlocks: 700,    // Number of blocks to wait for deployment to succeed
      skipDryRun: true,       // Skip the dry run before migrations
      networkCheckTimeout: 2500000
    }
  },
  compilers: {
    solc: {
      version: "0.8.21",    // Fetch exact version from solc-bin (default: truffle's version)
      settings: {           // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200
        },
        evmVersion: "istanbul"
      }
    }
  }
};




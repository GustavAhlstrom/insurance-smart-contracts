# Insurance Smart Contract Project

## Overview
This project aims to develop a decentralized insurance application with two primary features:
1. Automated Claims Processing
2. Customizable Coverage

These features will leverage Ethereum smart contracts to provide efficiency, reduce fraud, and offer flexible insurance options.

## Project Structure
- **contracts/**: Contains the Solidity smart contracts.
- **frontend/**: Contains the frontend code.
- **migrations/**: Contains migration scripts.
- **test/**: Contains test scripts for the smart contracts.
- **.env**: Environment variables.
- **truffle-config.js**: Truffle configuration file.

## Development Environment Setup

### Prerequisites
- [Node.js](https://nodejs.org/)
- [Truffle](https://www.trufflesuite.com/truffle)
- [Ganache](https://www.trufflesuite.com/ganache)
- [MetaMask](https://metamask.io/)
- [Infura](https://infura.io/)

### Installation
1. **Clone the repository:**
   ```sh
   git clone <repository-url>
   cd insurance-smart-contracts
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up Infura:**
   - Create an Infura project and obtain your Infura Project ID.

4. **Set up MetaMask:**
   - Add the Sepolia test network to MetaMask:
     ```plaintext
     Network Name: Sepolia Test Network
     New RPC URL: https://sepolia.infura.io/v3/<INFURA_PROJECT_ID>
     Chain ID: 11155111
     Currency Symbol: SepoliaETH
     Block Explorer URL: https://sepolia.etherscan.io
     ```

5. **Get Sepolia test ETH:**
   - Use the [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia) to get test ETH.

6. **Create and populate the `.env` file:**
   - Create a `.env` file in the root directory and add the following:
     ```plaintext
     MNEMONIC="your twelve word mnemonic"
     INFURA_API_KEY="your infura project id"
     ```

### Configure Truffle
The `truffle-config.js` file should look like this:
```javascript
require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     
      port: 8545,            
      network_id: "*",       
    },
    sepolia: {
      provider: () => new HDWalletProvider(
        process.env.MNEMONIC,
        `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`
      ),
      network_id: 11155111,  
      gas: 4500000,        
      gasPrice: 10000000000 
    }
  },
  compilers: {
    solc: {
      version: "0.8.21"  
    }
  }
};
```

## Running the Project

1. **Start Ganache:**
   Open Ganache and start a new workspace.

2. **Compile the contracts:**
   ```sh
   truffle compile
   ```

3. **Deploy the contracts:**
   ```sh
   truffle migrate --network sepolia
   ```

4. **Run tests:**
   ```sh
   truffle test
   ```

## Important:
 Ensure you replace placeholder text like `<repository-url>`, `<INFURA_PROJECT_ID>`, and `your twelve word mnemonic` with the actual values.
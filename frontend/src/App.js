import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import logo from './Ensurify.png';
import './App.css';
import ComplianceABI from './Contracts/Compliance.json';
import UtilityABI from './Contracts/Utility.json';
import ClaimsProcessingABI from './Contracts/ClaimsProcessing.json';
import CoreContractABI from './Contracts/CoreContract.json';
import CustomizableCoverageABI from './Contracts/CustomizableCoverage.json';
import DataStorageABI from './Contracts/DataStorage.json';
import ExternalDataIntegrationABI from './Contracts/ExternalDataIntegration.json';

const App = () => {
  const [account, setAccount] = useState('');
  const [complianceContract, setComplianceContract] = useState(null);
  const [utilityContract, setUtilityContract] = useState(null);
  const [claimsProcessingContract, setClaimsProcessingContract] = useState(null);
  const [customizableCoverageContract, setCustomizableCoverageContract] = useState(null);
  const [dataStorageContract, setDataStorageContract] = useState(null);
  const [externalDataIntegrationContract, setExternalDataIntegrationContract] = useState(null);
  const [coreContract, setCoreContract] = useState(null);
  const [complianceData, setComplianceData] = useState('');
  const [premiumData, setPremiumData] = useState('');
  const [claimStatus, setClaimStatus] = useState('');
  const [coverageDetails, setCoverageDetails] = useState('');
  const [premium, setPremium] = useState('');

  let web3;

  const loadContract = async (abi, contractStateSetter = null, networkId) => {
    const deployedNetwork = abi.networks[networkId];
    if (deployedNetwork) {
      const contract = new web3.eth.Contract(abi.abi, deployedNetwork.address);
      if (contractStateSetter) {
        contractStateSetter(contract);
      }
      return contract;
    } else {
      alert(`${abi.contractName} contract not deployed to detected network.`);
      return null;
    }
  };

  const loadBlockchainData = async () => {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
        console.error("User denied account access");
      }

      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const networkId = await web3.eth.net.getId();

      const coreContract = await loadContract(CoreContractABI, setCoreContract, networkId);

      if (coreContract) {
        const isRegistered = await coreContract.methods.authenticateUser(accounts[0]).call();
        if (!isRegistered) {
          try {
            await coreContract.methods.registerUser(accounts[0]).send({ from: accounts[0] });
          } catch (error) {
            if (error.code === 4001) {
              console.log('Transaction rejected by user.');
            } else {
              console.error('An error occurred:', error);
            }
          }
        }
      }

      await loadContract(ComplianceABI, setComplianceContract, networkId);
      await loadContract(UtilityABI, setUtilityContract, networkId);
      await loadContract(ClaimsProcessingABI, setClaimsProcessingContract, networkId);
      await loadContract(CustomizableCoverageABI, setCustomizableCoverageContract, networkId);
      await loadContract(DataStorageABI, setDataStorageContract, networkId);
      await loadContract(ExternalDataIntegrationABI, setExternalDataIntegrationContract, networkId);
    } else {
      alert('Please install MetaMask!');
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const checkCompliance = async () => {
    if (complianceContract) {
      const result = await complianceContract.methods
        .checkGDPRCompliance(account)
        .call({ from: account });
      setComplianceData(result);
    }
  };

  const calculatePremium = async () => {
    if (utilityContract) {
      const coverageBytes32 = Web3.utils.asciiToHex(coverageDetails.padEnd(32));
      const result = await utilityContract.methods
        .calculatePremium(coverageBytes32)
        .call({ from: account });
      setPremiumData(result);
    }
  };

  const processClaim = async () => {
    if (claimsProcessingContract && coreContract) {
      const isRegistered = await coreContract.methods.authenticateUser(account).call();
      if (!isRegistered) {
        try {
          await coreContract.methods.registerUser(account).send({ from: account });
        } catch (error) {
          if (error.code === 4001) {
            console.log('Transaction rejected by user.');
            return;
          } else {
            console.error('An error occurred:', error);
            return;
          }
        }
      }

      try {
        const result = await claimsProcessingContract.methods
          .processClaim(Web3.utils.keccak256("Claim123"))
          .call({ from: account });
        setClaimStatus(result);
      } catch (error) {
        if (error.code === 4001) {
          console.log('Transaction rejected by user.');
        } else {
          console.error('An error occurred:', error);
        }
      }
    }
  };

  const customizeCoverage = async () => {
    if (customizableCoverageContract) {
      const coverageBytes32 = Web3.utils.asciiToHex(coverageDetails);
      try {
        const result = await customizableCoverageContract.methods
          .customizeCoverage(account, coverageBytes32, premium)
          .send({ from: account });
        console.log('Coverage customized:', result);
      } catch (error) {
        if (error.code === 4001) {
          console.log('Transaction rejected by user.');
        } else {
          console.error('An error occurred:', error);
        }
      }
    }
  };

  const storeData = async () => {
    if (dataStorageContract) {
      const key = Web3.utils.asciiToHex("Important Data").slice(0, 66);
      const paddedKey = Web3.utils.padRight(key, 64);
      const value = Web3.utils.asciiToHex("Value to store");

      try {
        const result = await dataStorageContract.methods
          .storeData(paddedKey, value)
          .send({ from: account });

        console.log('Data stored:', result);
      } catch (error) {
        if (error.code === 4001) {
          console.log('Transaction rejected by user.');
        } else {
          console.error('An error occurred:', error);
        }
      }
    }
  };

  const integrateData = async () => {
    if (externalDataIntegrationContract) {
      try {
        const result = await externalDataIntegrationContract.methods
          .integrateData("0xOracleAddress")
          .call({ from: account });
        console.log('Data integrated:', result);
      } catch (error) {
        if (error.code === 4001) {
          console.log('Transaction rejected by user.');
        } else {
          console.error('An error occurred:', error);
        }
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Ensurify</h1>
        <h2>'Insurance, the smart way'</h2>
        <p>Your Account: {account}</p>

        <div>
          <input
            type="text"
            placeholder="Enter Coverage Details"
            value={coverageDetails}
            onChange={(e) => setCoverageDetails(e.target.value)}
          />
          <input
            type="number"
            placeholder="Enter Premium Amount"
            value={premium}
            onChange={(e) => setPremium(e.target.value)}
          />
          <button onClick={customizeCoverage}>Customize Coverage</button>
        </div>

        <button onClick={checkCompliance}>Check Compliance</button>
        {complianceData && <p>GDPR Compliance: {complianceData.toString()}</p>}

        <button onClick={calculatePremium}>Calculate Premium</button>
        {premiumData && <p>Calculated Premium: {premiumData.toString()}</p>}

        <button onClick={processClaim}>Process Claim</button>
        {claimStatus && <p>Claim Status: {claimStatus.toString()}</p>}

        <button onClick={storeData}>Store Data</button>

        <button onClick={integrateData}>Integrate External Data</button>

      </header>
    </div>
  );
};

export default App;

















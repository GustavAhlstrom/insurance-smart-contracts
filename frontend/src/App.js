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
  const [coreContract, setCoreContract] = useState(null);
  const [customizableCoverageContract, setCustomizableCoverageContract] = useState(null);
  const [dataStorageContract, setDataStorageContract] = useState(null);
  const [externalDataIntegrationContract, setExternalDataIntegrationContract] = useState(null);
  const [complianceData, setComplianceData] = useState('');
  const [premiumData, setPremiumData] = useState('');
  const [claimStatus, setClaimStatus] = useState('');
  const [coverageDetails, setCoverageDetails] = useState('');

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();

      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const networkId = await web3.eth.net.getId();

      const loadContract = async (abi, contractStateSetter) => {
        const deployedNetwork = abi.networks[networkId];
        if (deployedNetwork) {
          const contract = new web3.eth.Contract(abi.abi, deployedNetwork.address);
          contractStateSetter(contract);
        } else {
          alert(`${abi.contractName} contract not deployed to detected network.`);
        }
      };

      // Load all contracts
      await loadContract(ComplianceABI, setComplianceContract);
      await loadContract(UtilityABI, setUtilityContract);
      await loadContract(ClaimsProcessingABI, setClaimsProcessingContract);
      await loadContract(CoreContractABI, setCoreContract);
      await loadContract(CustomizableCoverageABI, setCustomizableCoverageContract);
      await loadContract(DataStorageABI, setDataStorageContract);
      await loadContract(ExternalDataIntegrationABI, setExternalDataIntegrationContract);
    } else {
      alert('Please install MetaMask!');
    }
  };

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
      const result = await utilityContract.methods
        .calculatePremium(web3.utils.asciiToHex("Coverage Details"))
        .call({ from: account });
      setPremiumData(result);
    }
  };

  const processClaim = async () => {
    if (claimsProcessingContract) {
      const result = await claimsProcessingContract.methods
        .processClaim(web3.utils.keccak256("Claim123"))
        .call({ from: account });
      setClaimStatus(result);
    }
  };

  const customizeCoverage = async () => {
    if (customizableCoverageContract) {
      const result = await customizableCoverageContract.methods
        .customizeCoverage(account, "High", 1000)
        .send({ from: account });
      console.log('Coverage customized:', result);
    }
  };

  const storeData = async () => {
    if (dataStorageContract) {
      const result = await dataStorageContract.methods
        .storeData(web3.utils.asciiToHex("Important Data"))
        .send({ from: account });
      console.log('Data stored:', result);
    }
  };

  const integrateData = async () => {
    if (externalDataIntegrationContract) {
      const result = await externalDataIntegrationContract.methods
        .integrateData("0xOracleAddress")
        .call({ from: account });
      console.log('Data integrated:', result);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Insurance Smart Contract</h1>
        <p>Your Account: {account}</p>

        <button onClick={checkCompliance}>Check Compliance</button>
        {complianceData && <p>GDPR Compliance: {complianceData.toString()}</p>}

        <button onClick={calculatePremium}>Calculate Premium</button>
        {premiumData && <p>Calculated Premium: {premiumData.toString()}</p>}

        <button onClick={processClaim}>Process Claim</button>
        {claimStatus && <p>Claim Status: {claimStatus.toString()}</p>}

        <button onClick={customizeCoverage}>Customize Coverage</button>

        <button onClick={storeData}>Store Data</button>

        <button onClick={integrateData}>Integrate External Data</button>

        {/* Add more buttons and interactions as needed */}
      </header>
    </div>
  );
};

export default App;




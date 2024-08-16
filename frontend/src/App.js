import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { create } from 'ipfs-http-client'; // Import IPFS client
import CryptoJS from 'crypto-js'; // Import CryptoJS for encryption/decryption
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
  const [policyDetails, setPolicyDetails] = useState(null); // New state for policy details
  const [fileHash, setFileHash] = useState(''); // New state for file hash
  const [encryptionKey, setEncryptionKey] = useState(''); // State for encryption key

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isConsentGiven, setIsConsentGiven] = useState(false);

  const ipfs = create({ host: 'ipfs.alchemyapi.io', port: 443, protocol: 'https' });

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

  // Function to handle encryption key input
  const handleKeyInput = (e) => {
    setEncryptionKey(e.target.value);
  };

  // Function to encrypt the file before uploading
  const encryptFile = (file, key) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result;
        const encrypted = CryptoJS.AES.encrypt(fileContent, key).toString();
        resolve(encrypted);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const uploadFileToIPFS = async (file, key) => {
    if (!isConsentGiven) {
      setIsModalVisible(true); // Show the consent modal
      return; // Exit the function to wait for user consent
    }

    try {
      const encryptedFile = await encryptFile(file, key);
      const added = await ipfs.add(encryptedFile);
      setFileHash(added.path);
      console.log('File uploaded to IPFS:', added.path);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const decryptFile = (encryptedData, key) => {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8);
    return decrypted;
  };

  const retrieveAndDecryptFile = async () => {
    try {
      // Retrieve the encrypted file from IPFS using its hash
      const file = await ipfs.cat(fileHash);

      // Decrypt the retrieved file using the provided encryption key
      const decryptedFile = decryptFile(file, encryptionKey);

      // Log the decrypted file content to the console
      console.log('Decrypted file:', decryptedFile);
    } catch (error) {
      // Handle any errors that occur during retrieval or decryption
      console.error('Error retrieving or decrypting file:', error);
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

  const createOrUpdatePolicy = async () => {
    if (customizableCoverageContract) {
      const coverageBytes32 = Web3.utils.asciiToHex(coverageDetails);
      try {
        // First, check if a policy already exists for the user
        const existingPolicy = await customizableCoverageContract.methods
          .getPolicyDetails(account)
          .call();

        if (existingPolicy.id !== "0") {
          // If the policy exists, update it with the new file hash
          const result = await customizableCoverageContract.methods
            .updatePolicy(coverageBytes32, premium, fileHash) // Include fileHash here
            .send({ from: account });
          console.log('Policy updated:', result);
        } else {
          // If no policy exists, create a new one with the file hash
          const result = await customizableCoverageContract.methods
            .createCustomPolicy(coverageBytes32, premium, fileHash) // Include fileHash here
            .send({ from: account });
          console.log('Policy created:', result);
        }
      } catch (error) {
        if (error.code === 4001) {
          console.log('Transaction rejected by user.');
        } else {
          console.error('An error occurred:', error);
        }
      }
    }
  };

  const getPolicyDetails = async () => {
    if (customizableCoverageContract) {
      try {
        const policy = await customizableCoverageContract.methods
          .getPolicyDetails(account)
          .call();
        setPolicyDetails(policy);
        setFileHash(policy.ipfsHash);  // Assuming ipfsHash is part of the policy details
        console.log('Policy details:', policy);
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
  };

  const deletePolicy = async () => {
    if (customizableCoverageContract) {
      try {
        const result = await customizableCoverageContract.methods
          .deletePolicy(account)
          .send({ from: account });
        console.log('Policy deleted:', result);
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
  };

  const ConsentModal = ({ onAccept }) => (
    <div className="modal">
      <div className="modal-content">
        <h2>Data Handling and Consent</h2>
        <p>
          By uploading a file, you agree that your data will be processed and stored
          on IPFS, a decentralized storage network. Please ensure you are aware of
          the implications of storing data on a decentralized network, where data
          cannot be easily removed.
        </p>
        <label>
          <input
            type="checkbox"
            onChange={(e) => setIsConsentGiven(e.target.checked)}
          />
          I agree to the data handling and consent to the terms.
        </label>
        <button onClick={() => onAccept()} disabled={!isConsentGiven}>
          Accept and Proceed
        </button>
      </div>
    </div>
  );

  return (
    <div className="App">
      <header className="App-header">
        {isModalVisible && (
          <ConsentModal
            onAccept={() => {
              setIsConsentGiven(true);
              setIsModalVisible(false);
              // Here, might need to ensure that the file and key used in uploadFileToIPFS are accessible
              // Might need to store them in a state variable when the user selects a file
              uploadFileToIPFS(selectedFile, encryptionKey); // Re-call the upload function
            }}
          />
        )}

        <img src={logo} className="App-logo" alt="logo" />
        <h1>Ensurify</h1>
        <h2>'Insurance, the smart way'</h2>
        <p>Your Account: {account}</p>

        <div className="input-row">
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
          <input
            type="password"
            placeholder="Enter Encryption Key"
            onChange={handleKeyInput}
          />
          <input
            type="file"
            onChange={(e) => {
              // Store the file in a state variable before showing the modal
              setSelectedFile(e.target.files[0]);
              setIsModalVisible(true);
            }}
          />
          <button onClick={createOrUpdatePolicy}>Customize Coverage</button>
        </div>

        <button onClick={checkCompliance}>Check Compliance</button>
        {complianceData && <p>GDPR Compliance: {complianceData.toString()}</p>}

        <button onClick={calculatePremium}>Calculate Premium</button>
        {premiumData && <p>Calculated Premium: {premiumData.toString()}</p>}

        <button onClick={processClaim}>Process Claim</button>
        {claimStatus && <p>Claim Status: {claimStatus.toString()}</p>}

        <button onClick={getPolicyDetails}>Get Policy Details</button>
        {policyDetails && (
          <div>
            <p>Policy ID: {policyDetails.id}</p>
            <p>Coverage Details: {Web3.utils.hexToAscii(policyDetails.coverageDetails)}</p>
            <p>Premium: {policyDetails.premium}</p>
          </div>
        )}

        <button onClick={deletePolicy}>Delete Policy</button>

        <button onClick={retrieveAndDecryptFile}>Retrieve and Decrypt File</button>

        <button onClick={storeData}>Store Data</button>

        <button onClick={integrateData}>Integrate External Data</button>
      </header>
    </div>
  );

export default App;




















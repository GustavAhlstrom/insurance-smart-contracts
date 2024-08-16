// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.21;

import "./CoreContract.sol";

contract CustomizableCoverage {
    CoreContract core;
    mapping(address => Policy) public policies;
    event PolicyCreated(address user, uint256 policyId);
    event PolicyUpdated(address user, uint256 policyId);
    event FileHashStored(address indexed user, string fileHash);

    struct Policy {
        uint256 id;
        bytes32 coverageDetails;
        uint256 premium;
        string ipfsHash; // Storing the IPFS hash for the policy document
    }

    modifier onlyRegisteredUser() {
        require(core.authenticateUser(msg.sender), "User not authenticated");
        _;
    }

    constructor(address _coreAddress) {
        core = CoreContract(_coreAddress);
    }

    function createCustomPolicy(bytes32 coverageDetails, uint256 premium, string memory ipfsHash) public onlyRegisteredUser {
        policies[msg.sender] = Policy({
            id: block.timestamp, // using timestamp as a simple unique identifier
            coverageDetails: coverageDetails,
            premium: premium,
            ipfsHash: ipfsHash
        });
        emit PolicyCreated(msg.sender, block.timestamp);
        emit FileHashStored(msg.sender, ipfsHash);
    }

    function updatePolicy(bytes32 newCoverageDetails, uint256 newPremium, string memory newIpfsHash) public onlyRegisteredUser {
        Policy storage policy = policies[msg.sender];
        policy.coverageDetails = newCoverageDetails;
        policy.premium = newPremium;
        policy.ipfsHash = newIpfsHash;
        emit PolicyUpdated(msg.sender, policy.id);
        emit FileHashStored(msg.sender, newIpfsHash);
    }

    function getPolicyDetails(address user) public view returns (Policy memory) {
        return policies[user];
    }
}


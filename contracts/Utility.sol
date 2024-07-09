// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.21;

contract Utility {
    event DataValidated(bytes data, bool valid);
    event PremiumCalculated(bytes32 coverageDetails, uint256 premium);
    event ExternalDataIntegrated(address oracle, bytes data);

    function validateData(bytes memory data) public returns (bool) {
        bool valid = true; // placeholder logic
        emit DataValidated(data, valid);
        return valid;
    }

    function calculatePremium(bytes32 coverageDetails) public returns (uint256) {
        uint256 premium = 100; // example fixed premium value
        emit PremiumCalculated(coverageDetails, premium);
        return premium;
    }

    function integrateExternalData(address oracle) public returns (bytes memory) {
        bytes memory data = "external data"; // placeholder logic
        emit ExternalDataIntegrated(oracle, data);
        return data;
    }
}

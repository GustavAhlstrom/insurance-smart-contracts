// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.21;

import "./CoreContract.sol";

contract ClaimsProcessing {
    CoreContract core;
    mapping(uint256 => Claim) public claims;
    uint256 public claimCount;
    event ClaimSubmitted(uint256 claimId, address user);
    event ClaimProcessed(uint256 claimId, bool success);
    event ClaimSettled(uint256 claimId);

    struct Claim {
        address user;
        uint256 policyId;
        bytes32 details;
        bool processed;
        bool settled;
    }

    modifier onlyRegisteredUser() {
        require(core.authenticateUser(msg.sender), "User not authenticated");
        _;
    }

    constructor(address _coreAddress) {
        core = CoreContract(_coreAddress);
    }

    function submitClaim(uint256 _policyId, bytes32 _details) public onlyRegisteredUser {
        claimCount++;
        claims[claimCount] = Claim(msg.sender, _policyId, _details, false, false);
        emit ClaimSubmitted(claimCount, msg.sender);
    }

    function processClaim(uint256 _claimId) public onlyRegisteredUser {
        Claim storage claim = claims[_claimId];
        require(!claim.processed, "Claim already processed");
        // Add processing logic here
        claim.processed = true;
        emit ClaimProcessed(_claimId, true);
    }

    function settleClaim(uint256 _claimId) public onlyRegisteredUser {
        Claim storage claim = claims[_claimId];
        require(claim.processed, "Claim not processed yet");
        require(!claim.settled, "Claim already settled");
        // Add settlement logic here
        claim.settled = true;
        emit ClaimSettled(_claimId);
    }
}

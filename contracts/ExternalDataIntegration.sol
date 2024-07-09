// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.21;

contract ExternalDataIntegration {
    address public oracle;
    event DataRequested(address oracle, bytes32 requestId);
    event DataReceived(bytes32 requestId, bytes data);

    constructor(address _oracle) {
        oracle = _oracle;
    }

    function requestData(bytes32 requestId) public {
        // Logic to request data from the oracle
        // Example: Sending a request to Chainlink or any other oracle service
        emit DataRequested(oracle, requestId);
    }

    function receiveData(bytes32 requestId, bytes memory data) public {
        // Logic to handle received data
        // Example: Storing the received data for further processing
        emit DataReceived(requestId, data);
        // Additional processing logic can be added here
    }
}

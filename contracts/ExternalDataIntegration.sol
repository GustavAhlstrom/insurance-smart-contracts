// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract ExternalDataIntegration is ChainlinkClient {
    using Chainlink for Chainlink.Request;
    
    // Oracle details for different data types
    struct OracleDetails {
        address oracle;
        bytes32 jobId;
        uint256 fee;
    }
    
    // Define oracles for different types of data
    OracleDetails public weatherOracle;
    OracleDetails public healthOracle;
    OracleDetails public financialOracle;

    // Store the results from the oracles
    bytes32 public weatherData;
    bytes32 public healthData;
    bytes32 public financialData;

    event DataRequested(address oracle, bytes32 requestId);
    event DataReceived(bytes32 requestId, bytes data);

    constructor(
        address _weatherOracle, bytes32 _weatherJobId, uint256 _weatherFee,
        address _healthOracle, bytes32 _healthJobId, uint256 _healthFee,
        address _financialOracle, bytes32 _financialJobId, uint256 _financialFee
    ) {
        setPublicChainlinkToken();

        // Initialize the oracles
        weatherOracle = OracleDetails(_weatherOracle, _weatherJobId, _weatherFee);
        healthOracle = OracleDetails(_healthOracle, _healthJobId, _healthFee);
        financialOracle = OracleDetails(_financialOracle, _financialJobId, _financialFee);
    }

    // Request weather data
    function requestWeatherData(string memory location) public {
        Chainlink.Request memory req = buildChainlinkRequest(weatherOracle.jobId, address(this), this.fulfillWeather.selector);
        req.add("q", location);
        req.add("copyPath", "weather.0.description");
        sendChainlinkRequestTo(weatherOracle.oracle, req, weatherOracle.fee);

        emit DataRequested(weatherOracle.oracle, req.id);
    }

    // Fulfill weather data
    function fulfillWeather(bytes32 _requestId, bytes32 _weatherData) public recordChainlinkFulfillment(_requestId) {
        weatherData = _weatherData;
        emit DataReceived(_requestId, abi.encodePacked(_weatherData));
    }

    // Request health data
    function requestHealthData(string memory healthQuery) public {
        Chainlink.Request memory req = buildChainlinkRequest(healthOracle.jobId, address(this), this.fulfillHealth.selector);
        req.add("query", healthQuery);
        sendChainlinkRequestTo(healthOracle.oracle, req, healthOracle.fee);

        emit DataRequested(healthOracle.oracle, req.id);
    }

    // Fulfill health data
    function fulfillHealth(bytes32 _requestId, bytes32 _healthData) public recordChainlinkFulfillment(_requestId) {
        healthData = _healthData;
        emit DataReceived(_requestId, abi.encodePacked(_healthData));
    }

    // Request financial data
    function requestFinancialData(string memory financialQuery) public {
        Chainlink.Request memory req = buildChainlinkRequest(financialOracle.jobId, address(this), this.fulfillFinancial.selector);
        req.add("query", financialQuery);
        sendChainlinkRequestTo(financialOracle.oracle, req, financialOracle.fee);

        emit DataRequested(financialOracle.oracle, req.id);
    }

    // Fulfill financial data
    function fulfillFinancial(bytes32 _requestId, bytes32 _financialData) public recordChainlinkFulfillment(_requestId) {
        financialData = _financialData;
        emit DataReceived(_requestId, abi.encodePacked(_financialData));
    }

    // Functions to retrieve the latest data
    function getWeatherData() public view returns (bytes32) {
        return weatherData;
    }

    function getHealthData() public view returns (bytes32) {
        return healthData;
    }

    function getFinancialData() public view returns (bytes32) {
        return financialData;
    }
}



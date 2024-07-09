const CoreContract = artifacts.require("CoreContract");
const ClaimsProcessing = artifacts.require("ClaimsProcessing");
const DataStorage = artifacts.require("DataStorage");
const CustomizableCoverage = artifacts.require("CustomizableCoverage");
const Compliance = artifacts.require("Compliance");
const Utility = artifacts.require("Utility");
const ExternalDataIntegration = artifacts.require("ExternalDataIntegration");

module.exports = function (deployer) {
    deployer.deploy(CoreContract).then(function () {
        return deployer.deploy(ClaimsProcessing, CoreContract.address);
    }).then(function () {
        return deployer.deploy(DataStorage);
    }).then(function () {
        return deployer.deploy(CustomizableCoverage, CoreContract.address);
    }).then(function () {
        return deployer.deploy(Compliance, CoreContract.address);
    }).then(function () {
        return deployer.deploy(Utility);
    }).then(function () {
        // Placeholder oracle address for development purposes 
        const placeholderOracleAddress = '0x0000000000000000000000000000000000000000';
        return deployer.deploy(ExternalDataIntegration, placeholderOracleAddress);
    });
};

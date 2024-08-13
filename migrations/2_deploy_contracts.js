const CoreContract = artifacts.require("CoreContract");
const ClaimsProcessing = artifacts.require("ClaimsProcessing");
const DataStorage = artifacts.require("DataStorage");
const CustomizableCoverage = artifacts.require("CustomizableCoverage");
const Compliance = artifacts.require("Compliance");
const Utility = artifacts.require("Utility");
const ExternalDataIntegration = artifacts.require("ExternalDataIntegration");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async function (deployer) {
    await deployer.deploy(CoreContract);
    await sleep(1000); // Wait 1 second between requests

    await deployer.deploy(ClaimsProcessing, CoreContract.address);
    await sleep(1000); // Wait 1 second between requests

    await deployer.deploy(DataStorage);
    await sleep(1000); // Wait 1 second between requests

    await deployer.deploy(CustomizableCoverage, CoreContract.address);
    await sleep(1000); // Wait 1 second between requests

    await deployer.deploy(Compliance, CoreContract.address);
    await sleep(1000); // Wait 1 second between requests

    await deployer.deploy(Utility);
    await sleep(1000); // Wait 1 second between requests

    // Placeholder oracle address for development purposes 
    const placeholderOracleAddress = '0x0000000000000000000000000000000000000000';
    await deployer.deploy(ExternalDataIntegration, placeholderOracleAddress);
};


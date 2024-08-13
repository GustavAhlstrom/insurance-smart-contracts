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

async function deployWithRetry(deployer, contract, args = [], retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            await deployer.deploy(contract, ...args);
            break;
        } catch (error) {
            console.error(`Deployment failed: ${error.message}. Retrying... (${i + 1}/${retries})`);
            await sleep(delay);
        }
    }
}

module.exports = async function (deployer) {
    await deployWithRetry(deployer, CoreContract);
    await sleep(8000);

    await deployWithRetry(deployer, ClaimsProcessing, [CoreContract.address]);
    await sleep(8000);

    await deployWithRetry(deployer, DataStorage);
    await sleep(8000);

    await deployWithRetry(deployer, CustomizableCoverage, [CoreContract.address]);
    await sleep(8000);

    await deployWithRetry(deployer, Compliance, [CoreContract.address]);
    await sleep(8000);

    await deployWithRetry(deployer, Utility);
    await sleep(8000);

    const placeholderOracleAddress = '0x0000000000000000000000000000000000000000';
    await deployWithRetry(deployer, ExternalDataIntegration, [placeholderOracleAddress]);
};

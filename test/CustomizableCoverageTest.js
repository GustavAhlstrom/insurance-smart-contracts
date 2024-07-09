const CoreContract = artifacts.require("CoreContract");
const CustomizableCoverage = artifacts.require("CustomizableCoverage");

contract("CustomizableCoverage", (accounts) => {
    it("should create a custom policy", async () => {
        const coreInstance = await CoreContract.deployed();
        await coreInstance.registerUser(accounts[1], { from: accounts[0] });

        const coverageInstance = await CustomizableCoverage.new(coreInstance.address);
        await coverageInstance.createCustomPolicy(web3.utils.asciiToHex("Coverage Details"), 100, { from: accounts[1] });

        const policy = await coverageInstance.getPolicyDetails(accounts[1]);
        assert.equal(policy.premium, 100, "Policy premium should be 100");
    });

    it("should update a policy", async () => {
        const coreInstance = await CoreContract.deployed();
        const coverageInstance = await CustomizableCoverage.deployed();

        await coverageInstance.updatePolicy(web3.utils.asciiToHex("New Coverage Details"), 200, { from: accounts[1] });

        const policy = await coverageInstance.getPolicyDetails(accounts[1]);
        assert.equal(policy.premium, 200, "Policy premium should be 200");
    });
});

const CoreContract = artifacts.require("CoreContract");
const Compliance = artifacts.require("Compliance");

contract("Compliance", (accounts) => {
    it("should check GDPR compliance", async () => {
        const coreInstance = await CoreContract.deployed();
        await coreInstance.registerUser(accounts[1], { from: accounts[0] });

        const complianceInstance = await Compliance.new(coreInstance.address);
        const compliant = await complianceInstance.checkGDPRCompliance(accounts[1]);

        assert.equal(compliant, true, "User should be GDPR compliant");
    });

    it("should audit a transaction", async () => {
        const complianceInstance = await Compliance.deployed();
        const success = await complianceInstance.auditTransaction(web3.utils.keccak256("transaction"));

        assert.equal(success, true, "Transaction should be audited successfully");
    });

    it("should generate a compliance report", async () => {
        const complianceInstance = await Compliance.deployed();
        const report = await complianceInstance.generateComplianceReport(accounts[1]);

        assert.equal(report, "Compliance report for user", "Compliance report should be generated");
    });
});

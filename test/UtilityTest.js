const Utility = artifacts.require("Utility");

contract("Utility", (accounts) => {
    it("should validate data", async () => {
        const instance = await Utility.deployed();
        const data = web3.utils.asciiToHex("data");
        const valid = await instance.validateData(data);

        assert.equal(valid, true, "Data should be validated");
    });

    it("should calculate premium", async () => {
        const instance = await Utility.deployed();
        const premium = await instance.calculatePremium(web3.utils.asciiToHex("Coverage Details"));

        assert.equal(premium, 100, "Premium should be 100");
    });

    it("should integrate external data", async () => {
        const instance = await Utility.deployed();
        const data = await instance.integrateExternalData(accounts[1]);

        assert.equal(data, "external data", "External data should be integrated");
    });
});

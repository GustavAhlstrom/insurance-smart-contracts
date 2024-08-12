const Utility = artifacts.require("Utility");

contract("Utility", (accounts) => {
    it("should validate data", async () => {
        const instance = await Utility.deployed();
        const data = web3.utils.asciiToHex("data");

        // Capture the result as an object
        const result = await instance.validateData(data);

        // Access the 'valid' field from the emitted event
        const valid = result.logs[0].args.valid;

        assert.equal(valid, true, "Data should be validated");
    });

    it("should calculate premium", async () => {
        const instance = await Utility.deployed();
        const result = await instance.calculatePremium(web3.utils.asciiToHex("Coverage Details"));

        // Access the 'premium' field from the emitted event
        const premium = result.logs[0].args.premium.toString();

        assert.equal(premium, "100", "Premium should be 100");
    });

    it("should integrate external data", async () => {
        const instance = await Utility.deployed();
        const result = await instance.integrateExternalData(accounts[1]);

        // Access the 'data' field from the emitted event
        const data = web3.utils.hexToAscii(result.logs[0].args.data);

        assert.equal(data, "external data", "External data should be integrated");
    });
});





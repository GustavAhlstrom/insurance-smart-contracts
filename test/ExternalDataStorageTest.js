const ExternalDataIntegration = artifacts.require("ExternalDataIntegration");

contract("ExternalDataIntegration", (accounts) => {
    it("should request data from oracle", async () => {
        const instance = await ExternalDataIntegration.new(accounts[1]);
        const requestId = web3.utils.keccak256("request");

        await instance.requestData(requestId);
        // Test event emitted correctly
    });

    it("should receive data from oracle", async () => {
        const instance = await ExternalDataIntegration.new(accounts[1]);
        const requestId = web3.utils.keccak256("request");
        const data = web3.utils.asciiToHex("data");

        await instance.receiveData(requestId, data);
        // Test event emitted correctly
    });
});

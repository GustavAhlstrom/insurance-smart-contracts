const CoreContract = artifacts.require("CoreContract");

contract("CoreContract", (accounts) => {
    it("should set the owner correctly", async () => {
        const instance = await CoreContract.deployed();
        const owner = await instance.owner();
        assert.equal(owner, accounts[0], "Owner should be the account that deployed the contract");
    });

    it("should register a user", async () => {
        const instance = await CoreContract.deployed();
        await instance.registerUser(accounts[1], { from: accounts[0] });
        const isRegistered = await instance.authenticateUser(accounts[1]);
        assert.equal(isRegistered, true, "User should be registered");
    });

    it("should not allow non-owner to register a user", async () => {
        const instance = await CoreContract.deployed();
        try {
            await instance.registerUser(accounts[2], { from: accounts[1] });
        } catch (error) {
            assert(error.message.includes("Only owner can call this function"), "Only owner can call this function");
            return;
        }
        assert(false, "Non-owner was able to register a user");
    });
});

const CoreContract = artifacts.require("CoreContract");
const ClaimsProcessing = artifacts.require("ClaimsProcessing");

contract("ClaimsProcessing", (accounts) => {
    it("should submit a claim", async () => {
        const coreInstance = await CoreContract.deployed();
        await coreInstance.registerUser(accounts[1], { from: accounts[0] });

        const claimsInstance = await ClaimsProcessing.new(coreInstance.address);
        await claimsInstance.submitClaim(1, web3.utils.asciiToHex("Details"), { from: accounts[1] });

        const claim = await claimsInstance.claims(1);
        assert.equal(claim.user, accounts[1], "Claim user should be accounts[1]");
    });

    it("should process a claim", async () => {
        const coreInstance = await CoreContract.deployed();
        const claimsInstance = await ClaimsProcessing.deployed();

        await claimsInstance.processClaim(1, { from: accounts[1] });

        const claim = await claimsInstance.claims(1);
        assert.equal(claim.processed, true, "Claim should be processed");
    });

    it("should settle a claim", async () => {
        const coreInstance = await CoreContract.deployed();
        const claimsInstance = await ClaimsProcessing.deployed();

        await claimsInstance.settleClaim(1, { from: accounts[1] });

        const claim = await claimsInstance.claims(1);
        assert.equal(claim.settled, true, "Claim should be settled");
    });
});

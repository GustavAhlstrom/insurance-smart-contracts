const DataStorage = artifacts.require("DataStorage");

contract("DataStorage", (accounts) => {
    it("should store and retrieve data", async () => {
        const instance = await DataStorage.deployed();
        const key = web3.utils.keccak256("key");
        const value = web3.utils.asciiToHex("value");

        await instance.storeData(key, value);
        const storedValue = await instance.retrieveData(key);

        assert.equal(storedValue, value, "Stored value should match retrieved value");
    });

    it("should delete data", async () => {
        const instance = await DataStorage.deployed();
        const key = web3.utils.keccak256("key");

        await instance.deleteData(key);
        const storedValue = await instance.retrieveData(key);

        assert.equal(storedValue, null, "Stored value should be deleted");
    });
});

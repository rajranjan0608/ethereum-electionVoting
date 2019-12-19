const Election = artifacts.require("./Election.sol");

contract("Election", function(accounts) {

    before(async () => {
        this.Election = await Election.deployed()
    });

    it("initializes with two candidates", async () => {
        var count = await this.Election.candidatesCount();
        assert.equal(count, 2);
    });

});
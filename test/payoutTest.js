const ScholarshipManager = artifacts.require("ScholarshipManager");
const Scholarship = artifacts.require("Scholarship");
const truffleAssert = require('truffle-assertions');
const TT = require("../test_helpers/timeTravel");

contract("receiving a payout", accounts => {

  describe.skip("#payout", () => {
    // Setup
    let expiredScholarship;
    let validScholarship;
    let startingSponsor1Balance;
    let startingSponsor2Balance;
    let startingRecipientBalance;
    before(async () => {
      expiredScholarship = await Scholarship.new(9, "_", "_", "_", { from: accounts[1], value: web3.toWei(1, 'ether') });
      validScholarship = await Scholarship.new(10, "_", "_", "_", { from: accounts[2], value: web3.toWei(1, 'ether') });
      await expiredScholarship.applyTo("test link", { from: accounts[3] });
      await validScholarship.applyTo("test link", { from: accounts[3] });
      await expiredScholarship.awardTo(accounts[3], { from: accounts[1] });
      await validScholarship.awardTo(accounts[3], { from: accounts[2] });
      startingSponsor1Balance = web3.eth.getBalance(accounts[1]).toNumber();
      startingSponsor2Balance = web3.eth.getBalance(accounts[2]).toNumber();
      TT.fastForward(10, "days");
    });
    // Tests
    it("should forbid receiving payout from an expired scholarship", async () => {
      await truffleAssert.reverts(validScholarship.payout({ from: accounts[3] }));
      assert(startingRecipientBalance > web3.eth.getBalance(accounts[3]).toNumber());
      assert(startingSponsor1Balance === web3.eth.getBalance(accounts[1]).toNumber());
    });
    it("should permit receiving payout from a valid scholarship", async () => {
      await validScholarship.payout({ from: accounts[3] });
      assert(startingRecipientBalance < web3.eth.getBalance(accounts[3]).toNumber());
      assert(startingSponsor2Balance === web3.eth.getBalance(accounts[2]).toNumber());
    });

  });

});

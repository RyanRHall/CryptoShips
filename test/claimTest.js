const ScholarshipManager = artifacts.require("ScholarshipManager");
const Scholarship = artifacts.require("Scholarship");
const truffleAssert = require("truffle-assertions");
const ganache = require("../test_helpers/ganache");

contract("claiming a scholarship", accounts => {

  describe("#claim", () => {
    let scholarshipManager;
    let validScholarship;
    let expiredScholarship;
    let recipientStartingBalance;

    before(async () => {
      scholarshipManager = await ScholarshipManager.deployed();
      const tx1 =  await scholarshipManager.create(
        10, "_", "_", "_", { from: accounts[1], value: web3.toWei(1, "ether") }
      );
      const tx2 =  await scholarshipManager.create(
        9, "_", "_", "_", { from: accounts[1], value: web3.toWei(1, "ether") }
      );
      validScholarship = Scholarship.at(tx1.logs[0].args.scholarshipAddress);
      expiredScholarship = Scholarship.at(tx2.logs[0].args.scholarshipAddress);
      await validScholarship.applyTo("application", { from: accounts[2] });
      await expiredScholarship.applyTo("application", { from: accounts[2] });
      await validScholarship.awardTo(accounts[2], { from: accounts[1] });
      await expiredScholarship.awardTo(accounts[2], { from: accounts[1] });
      recipientStartingBalance = accounts[2].balance;
      await ganache.fastForward(10, "days");
    })

    it("should reject claim attempts on expired scholarships", async () => {
      await truffleAssert.reverts(
        scholarshipManager.claim(expiredScholarship.address, "TEST", { from: accounts[2], value: web3.toWei(0.01, "ether") })
      );
    });

    it("should reject claim attempts from other accounts", async () => {
      await truffleAssert.reverts(
        scholarshipManager.claim(validScholarship.address, "TEST", { from: accounts[3], value: web3.toWei(0.01, "ether") })
      );
      await truffleAssert.reverts(
        scholarshipManager.claim(validScholarship.address, "TEST", { from: accounts[1], value: web3.toWei(0.01, "ether") })
      );
    });

    it("should permit claim attempts from recipient's account on valid scholarships", async () => {
      const tx = await scholarshipManager.claim(validScholarship.address, "INVALID_KEY", { from: accounts[2], value: web3.toWei(0.01, "ether") });
      const startingBlockHeight = await ganache.blockHeight();
      truffleAssert.eventEmitted(tx, "scholarshipVerificationRequestSent", ev => {
        assert.equal(ev.scholarshipAddress, validScholarship.address);
        assert.equal(ev.verificationKey, "INVALID_KEY");
        return true;
      });
      await ganache.waitForNewBlock();
      const endingBlockHeight = await ganache.blockHeight();
      assert.equal(endingBlockHeight, startingBlockHeight + 1);
    });

    it("should forbid claims with invalid key", async () => {
      const startingBalance = web3.eth.getBalance(accounts[2]).toNumber();
      await scholarshipManager.claim(validScholarship.address, "INVALID_KEY", { from: accounts[2], value: web3.toWei(0.01, "ether") });
      await ganache.waitForNewBlock();
      const endingBalance = web3.eth.getBalance(accounts[2]).toNumber();
      assert(startingBalance > endingBalance, "User should lose money on transaction, and receive no reward from invalid key");
    });
  });

  describe("#__callback", () => {

  });

});

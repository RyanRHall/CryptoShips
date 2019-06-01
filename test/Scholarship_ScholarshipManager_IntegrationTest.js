const ScholarshipManager = artifacts.require("ScholarshipManager");
const Scholarship = artifacts.require("Scholarship");
const truffleAssert = require("truffle-assertions");
const ganache = require("../test_helpers/ganache");
const { localOraclizeResolverAddress, testVerificationEndpoint } = require("../config/Constants.js")

contract("ScholarshipManager <--> Scholarship", accounts => {

  // roles
  const admin = accounts[1];
  const sponsor = accounts[2];
  const recipient = accounts[3];
  const stranger = accounts[4];

  // setup variables
  let scholarshipManager;
  let validScholarship;
  let expiredScholarship;
  let recipientStartingBalance;

  // reset function called before each test
  async function reset() {
    scholarshipManager = await ScholarshipManager.new(testVerificationEndpoint, { from: admin });
    await scholarshipManager.setOraclizeResolverAddress(localOraclizeResolverAddress, { from: admin });
    const tx1 =  await scholarshipManager.create(
      10, "_", "_", { from: sponsor, value: web3.toWei(1, "ether") }
    );
    const tx2 =  await scholarshipManager.create(
      9, "_", "_", { from: sponsor, value: web3.toWei(1, "ether") }
    );
    validScholarship = Scholarship.at(tx1.logs[0].args.scholarshipAddress);
    expiredScholarship = Scholarship.at(tx2.logs[0].args.scholarshipAddress);
    await validScholarship.applyTo("application", { from: recipient });
    await expiredScholarship.applyTo("application", { from: recipient });
    await validScholarship.awardTo(recipient, { from: sponsor });
    await expiredScholarship.awardTo(recipient, { from: sponsor });
    recipientStartingBalance = web3.eth.getBalance(recipient).toNumber();
    await ganache.fastForward(10, "days");
  }

  describe("#claim", () => {

    beforeEach(reset);

    it("should reject claim attempts on expired scholarships", async () => {
      await truffleAssert.reverts(
        expiredScholarship.claim("TEST", { from: recipient, value: web3.toWei(0.01, "ether") })
      );
    });

    it("should reject claim attempts from other accounts", async () => {
      await truffleAssert.reverts(
        validScholarship.claim("TEST", { from: stranger, value: web3.toWei(0.01, "ether") })
      );
      await truffleAssert.reverts(
        validScholarship.claim("TEST", { from: sponsor, value: web3.toWei(0.01, "ether") })
      );
    });

    it("should permit claim attempts from recipient's account on valid scholarships", async () => {
      const tx = await validScholarship.claim("INVALID_KEY", { from: recipient, value: web3.toWei(0.01, "ether") });
      const startingBlockHeight = await ganache.blockHeight();
      truffleAssert.eventEmitted(tx, "scholarshipVerificationRequestSent", ev => {
        assert.equal(ev.scholarshipAddress, validScholarship.address);
        assert.equal(ev.verificationKey, "INVALID_KEY");
        return true;
      });
      await ganache.waitForNewBlock();
      const endingBlockHeight = await ganache.blockHeight();
      assert.equal(endingBlockHeight, startingBlockHeight + 1);
      assert.equal(await validScholarship.verificationKey(), "INVALID_KEY");
    });

    it("should forbid claim attempts on claimed scholarship", async () => {
      await validScholarship.claim("VALID_KEY", { from: recipient, value: web3.toWei(0.01, "ether") });
      await ganache.waitForNewBlock();
      await truffleAssert.reverts(
        validScholarship.claim("VALID_KEY", { from: recipient, value: web3.toWei(0.01, "ether") })
      );
    });

    it("should forbid claim attempts on other scholarships with used key", async () => {
      const tx =  await scholarshipManager.create(
        10, "_", "_", { from: sponsor, value: web3.toWei(1, "ether") }
      );
      const otherValidScholarship = Scholarship.at(tx.logs[0].args.scholarshipAddress);
      await otherValidScholarship.applyTo("application", { from: recipient });
      await otherValidScholarship.awardTo(recipient, { from: sponsor });
      await validScholarship.claim("VALID_KEY", { from: recipient, value: web3.toWei(0.01, "ether") });
      await ganache.waitForNewBlock();
      // should fail with already used key
      await truffleAssert.reverts(
        otherValidScholarship.claim("VALID_KEY", { from: recipient, value: web3.toWei(0.01, "ether") })
      );
      // should work with different key
      await otherValidScholarship.claim("VALID_KEY_2", { from: recipient, value: web3.toWei(0.01, "ether") })
      await ganache.waitForNewBlock();
    });

  });

  describe("#__callback", () => {

    beforeEach(reset);

    it("should forbid calling #__callback from arbitrary addresses", async () => {
      for (var i = 0; i < 5; i++) {
        await truffleAssert.reverts(
          validScholarship.__callback(5, "true", { from: accounts[i] })
        );
        await truffleAssert.reverts(
          expiredScholarship.__callback(5, "true", { from: accounts[i] })
        );
      }
    });

    it("should forbid claims with invalid key", async () => {
      await validScholarship.claim("INVALID_KEY", { from: recipient, value: web3.toWei(0.01, "ether") });
      await ganache.waitForNewBlock();
      const recipientEndingBalance = web3.eth.getBalance(recipient).toNumber();
      assert(recipientStartingBalance > recipientEndingBalance, "User should lose money on transaction, and receive no reward from invalid key");
    });

    it("should permit claims with valid key", async () => {
      await validScholarship.claim("VALID_KEY", { from: recipient, value: web3.toWei(0.01, "ether") });
      await ganache.waitForNewBlock();
      const recipientEndingBalance = web3.eth.getBalance(recipient).toNumber();
      assert(recipientStartingBalance < recipientEndingBalance, "User should receive reward from valid key");
    });

    it("should permit claims with valid key after forbidding claim with invalid key", async () => {
      await validScholarship.claim("INVALID_KEY", { from: recipient, value: web3.toWei(0.01, "ether") });
      await ganache.waitForNewBlock();
      await validScholarship.claim("VALID_KEY", { from: recipient, value: web3.toWei(0.01, "ether") });
      await ganache.waitForNewBlock();
      const recipientEndingBalance = web3.eth.getBalance(recipient).toNumber();
      assert(recipientStartingBalance < recipientEndingBalance, "User should receive reward from valid key");
    });

    it("should mark verificationKey as used after successful claim", async () => {
      assert.equal(await scholarshipManager.wasVerificationKeyUsed("VALID_KEY"), false);
      await validScholarship.claim("VALID_KEY", { from: recipient, value: web3.toWei(0.01, "ether") });
      await ganache.waitForNewBlock();
      assert.equal(await scholarshipManager.wasVerificationKeyUsed("VALID_KEY"), true);
    });

  });

});

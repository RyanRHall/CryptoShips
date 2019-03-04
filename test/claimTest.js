const ScholarshipManager = artifacts.require("ScholarshipManager");
const Scholarship = artifacts.require("Scholarship");
const truffleAssert = require('truffle-assertions');
const TT = require("../test_helpers/timeTravel");

contract("claiming a scholarship", accounts => {

  describe.only("#claim", () => {
    let scholarshipManager;
    let validScholarship;
    let expiredScholarship;
    let recipientStartingBalance;

    before(async () => {
      scholarshipManager = await ScholarshipManager.deployed();
      const tx1 =  await scholarshipManager.create(
        10, "_", "_", "_", { from: accounts[1], value: web3.toWei(1, 'ether') }
      );
      const tx2 =  await scholarshipManager.create(
        9, "_", "_", "_", { from: accounts[1], value: web3.toWei(1, 'ether') }
      );
      validScholarship = Scholarship.at(tx1.logs[0].args.scholarship);
      expiredScholarship = Scholarship.at(tx2.logs[0].args.scholarship);
      await validScholarship.applyTo("application", { from: accounts[2] });
      await expiredScholarship.applyTo("application", { from: accounts[2] });
      await validScholarship.awardTo(accounts[2], { from: accounts[1] });
      await expiredScholarship.awardTo(accounts[2], { from: accounts[1] });
      recipientStartingBalance = accounts[2].balance;
      await TT.fastForward(10, "days");
    })

    // assert.equal((await web3.eth.getBalance(validScholarship.address)).toString(10), web3.toWei(1, 'ether'));
    // it("should reject invalid validation key", async () => {
    //   // TODO get price to send for ORAZLIZE
    //   await truffleAssert.reverts(
    //     scholarshipManager.claim(validScholarship.address, "false", { from: accounts[2], value: web3.toWei(0.01, 'ether') })
    //   );
    //   await truffleAssert.reverts(
    //     scholarshipManager.claim(expiredScholarship.address, "false", { from: accounts[2], value: web3.toWei(0.01, 'ether') })
    //   );
    // });

    it("should reject claims on expired scholarships", async () => {
      await truffleAssert.reverts(
        scholarshipManager.claim(expiredScholarship.address, "TEST", { from: accounts[2], value: web3.toWei(0.01, 'ether') })
      );
    });

    it("should reject claims from other accounts", async () => {
      await truffleAssert.reverts(
        scholarshipManager.claim(validScholarship.address, "TEST", { from: accounts[3], value: web3.toWei(0.01, 'ether') })
      );
      await truffleAssert.reverts(
        scholarshipManager.claim(validScholarship.address, "TEST", { from: accounts[1], value: web3.toWei(0.01, 'ether') })
      );
    });

    it("should permit claims from recipient's account on valid scholarships", async () => {
      await scholarshipManager.claim(validScholarship.address, "TEST", { from: accounts[2], value: web3.toWei(0.01, 'ether') });
      await TT.fastForward(1, "days");
      assert.equal((await web3.eth.getBalance(validScholarship.address)).toString(10), web3.toWei(0, 'ether'));
    });
  });

  describe("#__callback", () => {

  });

});

const ScholarshipManager = artifacts.require("ScholarshipManager");
const truffleAssert = require("truffle-assertions");
const { localOraclizeResolverAddress, testVerificationEndpoint, zeroAddress } = require("../config/Constants.js")

contract("ScholarshipManager", accounts => {

  // roles
  const admin = accounts[1];
  const sponsor = accounts[2];
  const stranger = accounts[3];

  // setup variables
  let scholarshipManager;

  before(async () => {
    scholarshipManager = await ScholarshipManager.new(testVerificationEndpoint, { from: admin });
  });

  describe("#constructor", () => {
    it("should use the testing endpoint", async () => {
      const endpoint = await scholarshipManager.testVerificationEndpoint();
      assert.equal(endpoint, testVerificationEndpoint)
    });

    it("should not have any scholarships to begin with", async () => {
      const scholarships = await scholarshipManager.getScholarshipAddresses();
      assert.equal(scholarships.length, 0);
    });

    it("should does not have an oraclizeResolverAddress set", async () => {
      const address = await scholarshipManager.oraclizeResolverAddress();
      assert.equal(address, zeroAddress);
    });
  });

  describe("#setOraclizeResolverAddress", () => {
    it("should reject attempts to set resolver address by users other than the owner", async () => {
      await truffleAssert.reverts(
        scholarshipManager.setOraclizeResolverAddress(localOraclizeResolverAddress, { from: stranger })
      );
      assert.equal(await scholarshipManager.oraclizeResolverAddress(), zeroAddress);
    });

    it("should permit admin to set resolver address", async () => {
      await scholarshipManager.setOraclizeResolverAddress(localOraclizeResolverAddress, { from: admin });
      assert.equal(await scholarshipManager.oraclizeResolverAddress(), localOraclizeResolverAddress);
    });
  })

  describe("#create", () => {
    it("should permit creation of scholarships", async () => {
      await scholarshipManager.create(10, "test school", "test course", { from: sponsor, value: web3.toWei(0.01, "ether") });
      const scholarships = await scholarshipManager.getScholarshipAddresses();
      assert.equal(scholarships.length, 1);
    });
  });

  describe("#setVerificationKeyUsed", () => {
    it("should forbid calling #setVerificationKeyUsed from arbitrary addresses", async () => {
      for (var i = 0; i < 4; i++) {
        await truffleAssert.reverts(
          scholarshipManager.setVerificationKeyUsed("KEY", { from: accounts[i] })
        );
      }
    });
  });

});

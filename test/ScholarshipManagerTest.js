const ScholarshipManager = artifacts.require("ScholarshipManager");
const truffleAssert = require('truffle-assertions');

contract("ScholarshipManager", accounts => {
  let scholarshipManager;

  before(async () => {
    scholarshipManager = await ScholarshipManager.deployed();
  })

  it("should use the testing endpoint", async () => {
    const endpoint = await scholarshipManager.verificationEndpoint();
    assert.equal(endpoint, "http://localhost:8080/test")
  });

  it("should not have any scholarships to begin with", async () => {
    const scholarships = await scholarshipManager.getScholarships();
    assert.equal(scholarships.length, 0);
  });

  it("allows creation of scholarships", async () => {
    await scholarshipManager.create(10, "test instructions", "test school", "test course");
    const scholarships = await scholarshipManager.getScholarships();
    assert.equal(scholarships.length, 1);
  });

  describe("#__callback", () => {
    it("separates address and key", async () => {
      const transaction = await scholarshipManager.__callback(5, "0x0000000000000000000000000000000000000111:TEST_KEY");
      truffleAssert.eventEmitted(transaction, 'scholarshipVerified', ev => {
        return ev.scholarshipAddress === "0x0000000000000000000000000000000000000111" && ev.verificationKey === "TEST_KEY";
      });
    });
  });

});

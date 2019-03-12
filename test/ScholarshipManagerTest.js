const ScholarshipManager = artifacts.require("ScholarshipManager");
const truffleAssert = require('truffle-assertions');

contract("ScholarshipManager", accounts => {
  let scholarshipManager;

  before(async () => {
    scholarshipManager = await ScholarshipManager.new("http://verify.cryptoships.xyz/test", "0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475", { from: accounts[0] });
  })

  it("should use the testing endpoint", async () => {
    const endpoint = await scholarshipManager.verificationEndpoint();
    assert.equal(endpoint, "http://verify.cryptoships.xyz/test")
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

});

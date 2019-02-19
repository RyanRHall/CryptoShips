const ScholarshipManager = artifacts.require("ScholarshipManager");

contract("ScholarshipManager", async (accounts) => {
  let scholarshipManager;

  before(async () => {
    scholarshipManager = await ScholarshipManager.deployed();
  })

  // it("should", async () => {
  // });

  it("should use the testing endpoint", async () => {
    const endpoint = await scholarshipManager.verificationEndpoint();
    assert.equal(endpoint, "http://localhost:8080")
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

const ScholarshipManagerArtifact = artifacts.require("ScholarshipManager");

contract("ScholarshipManager", async (accounts) => {
  let ScholarshipManager;

  before(async () => {
    ScholarshipManager = await ScholarshipManagerArtifact.deployed();
  })

  // it("should", async () => {

  // });

  it("should use the testing endpoint", async () => {
    const endpoint = await ScholarshipManager.verificationEndpoint();
    assert.equal("http://localhost:8080", endpoint)
  });

  it("should not have any scholarships to begin with", async () => {
    const scholarships = await ScholarshipManager.getScholarships();
    assert.equal(0, scholarships.length);
  });

  it("allows creation of scholarships", async () => {
    await ScholarshipManager.create(10, "test instructions", "test school", "test course");
    const scholarships = await ScholarshipManager.getScholarships();
    assert.equal(1, scholarships.length);
  });
});

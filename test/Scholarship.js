const Scholarship = artifacts.require("Scholarship");
const truffleAssert = require('truffle-assertions');

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// it("should", async () => {
// });

contract("Scholarship", accounts => {

  describe("#constructor", () => {
    // Setup
    let scholarship;
    before(async () => {
      scholarship = await Scholarship.new(10, "test instructions", "test school", "test course", { from: accounts[1] });
      console.log(await scholarship.startedOn());
      console.log(await scholarship.daysToComplete());
    })
    // Tests
    it("should be sponsored by transaction author", async () => {
      assert.equal(await scholarship.sponsor(), accounts[1]);
    });
    it("should not have a recipient", async () => {
      assert.equal(await scholarship.recipient(), ZERO_ADDRESS);
    });
    it("should appropriately assign constructor arguments", async () => {
      assert.equal(await scholarship.daysToComplete(), 10);
      assert.equal(await scholarship.instructions(), "test instructions");
      assert.equal(await scholarship.schoolName(), "test school");
      assert.equal(await scholarship.courseName(), "test course");
    });
    it("should not have any applicants", async () => {
      assert.equal((await scholarship.getApplicants()).length, 0);
    });
  })

  describe("#applyTo", () => {
    // Setup
    let scholarship;
    before(async () => {
      scholarship = await Scholarship.new(10, "test instructions", "test school", "test course", { from: accounts[1] });
      await scholarship.applyTo("test link 2", { from: accounts[2] });
      await scholarship.applyTo("test link 3", { from: accounts[3] });
    // Tests
    it("should add the application link to the mapping", async () => {
      assert.equal(await scholarship.applications(accounts[2]), "test link 2");
      assert.equal(await scholarship.applications(accounts[3]), "test link 3");
    });
    it("should add the applicant to the list of applicants", async () => {
      assert.equal((await scholarship.getApplicants()).length, 2);
      assert.equal(await scholarship.applicants(0), accounts[2]);
      assert.equal(await scholarship.applicants(1), accounts[3]);
    });
  });

  describe("#awardTo", () => {
    // Setup
    let scholarship;
    before(async () => {
      scholarship = await Scholarship.new(10, "test instructions", "test school", "test course", { from: accounts[1] });
      await scholarship.applyTo("test link 2", { from: accounts[2] });
      await scholarship.applyTo("test link 3", { from: accounts[3] });
      await scholarship.awardTo(accounts[2], { from: accounts[1] });
    });
    // Tests
    it("should not be invokable by anyone other than the sponsor", async () => {
      await truffleAssert.reverts(scholarship.awardTo(accounts[3], { from: accounts[2] }));
    });
    it("should mark recipient", async () => {
      assert.equal(await scholarship.recipient(), accounts[2]);
    });
    it("should not permit changing recipient", async () => {
      await truffleAssert.reverts(scholarship.awardTo(accounts[3], { from: accounts[1] }));
      assert.equal(await scholarship.recipient(), accounts[2]);
    });
  });

  describe("#getApplications", () => {
    // Setup
    let scholarship;
    before(async () => {
      scholarship = await Scholarship.new(10, "test instructions", "test school", "test course", { from: accounts[1] });
      await scholarship.applyTo("test link 2", { from: accounts[2] });
      await scholarship.applyTo("test link 3", { from: accounts[3] });
      await scholarship.awardTo(accounts[2], { from: accounts[1] });
    });
    // Tests
  });



});

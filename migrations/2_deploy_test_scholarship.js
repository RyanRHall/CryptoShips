var Scholarship = artifacts.require("./Scholarship.sol");

module.exports = function(deployer) {
  deployer.deploy(Scholarship, 5, "test");
};

var ScholarshipManager = artifacts.require("./ScholarshipManager.sol");

// determine endpoint to use for verifying courses
const verificationEndpoint = process.env.NODE_ENV === "production" ? "http://verify.cryptoships.xyz"  : "http://localhost:8080/test";

// deploy the scholarship manager contract!
module.exports = function(deployer) {
  deployer.deploy(ScholarshipManager, verificationEndpoint);
};

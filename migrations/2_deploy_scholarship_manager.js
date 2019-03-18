var ScholarshipManager = artifacts.require("./ScholarshipManager.sol");

// determine endpoint to use for verifying courses
const verificationEndpoint = process.env.NODE_ENV === "production" ? "http://verify.cryptoships.xyz"  : "http://verify.cryptoships.xyz/test";

// deploy the scholarship manager contract!
module.exports = async function(deployer) {
  switch(process.env.NODE_ENV) {
    case "production":
      deployer.deploy(ScholarshipManager, verificationEndpoint, "0x0000000000000000000000000000000000000000");
      break;
    case "development":
      deployer.deploy(ScholarshipManager, verificationEndpoint, "0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475");
      break;
  }
};

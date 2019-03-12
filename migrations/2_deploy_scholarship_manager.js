var ScholarshipManager = artifacts.require("./ScholarshipManager.sol");
var OraclizeAddrResolver = artifacts.require("./OraclizeAddrResolverI.sol");
var ScholarshipManager = artifacts.require("./ScholarshipManager.sol");

// determine endpoint to use for verifying courses
const verificationEndpoint = process.env.NODE_ENV === "production" ? "http://verify.cryptoships.xyz"  : "http://verify.cryptoships.xyz/test";

// deploy the scholarship manager contract!
module.exports = async function(deployer) {
  if (process.env.NODE_ENV !== "production") {
    deployer.deploy(ScholarshipManager, verificationEndpoint, "0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475");
  } else {
    deployer.deploy(ScholarshipManager, verificationEndpoint, "0x0000000000000000000000000000000000000000");
  }
};

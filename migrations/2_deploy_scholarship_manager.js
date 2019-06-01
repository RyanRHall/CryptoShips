var ScholarshipManager = artifacts.require("./ScholarshipManager.sol");
const { localOraclizeResolverAddress, testVerificationEndpoint, prodVerificationEndpoint, zeroAddress } = require("../config/Constants.js")


// determine endpoint to use for verifying courses
const endpoint = process.env.NODE_ENV === "production" ? prodVerificationEndpoint : testVerificationEndpoint;

// deploy the scholarship manager contract!
module.exports = async function(deployer) {
  switch(process.env.NODE_ENV) {
    case "production":
      deployer.deploy(ScholarshipManager, endpoint);
      break;
    case "development":
      const manager = await deployer.deploy(ScholarshipManager, endpoint);
      await manager.setOraclizeResolverAddress(localOraclizeResolverAddress);
      break;
  }
};

const SCHOLARSHIP_SEEDS = [
  [ "Amazon Web Services", "AWS Fundamentals: Going Cloud-Native" ],
  [ "Princeton University", "Bitcoin and Cryptocurrency Technologies" ],
  [ "Stanford University", "Cryptography I" ],
  [ "University of Michigan", "Securing Digital Democracy" ],
  [ "University of Washington", "Machine Learning Foundations: A Case Study " ]
];

module.exports = async function(callback) {
  var ScholarshipManager = artifacts.require("./ScholarshipManager.sol");
  var Scholarship = artifacts.require("./Scholarship.sol");
  // Retrieve deployed manager
  const scholarshipManager = await ScholarshipManager.deployed();
  // create scholarships!
  let scholarshipAddress;
  for (let idx = 0; idx < SCHOLARSHIP_SEEDS.length; idx++) {
    scholarshipAddress = (await scholarshipManager.create(
      Math.floor(Math.random() * 100) + 150,
      ...SCHOLARSHIP_SEEDS[idx],
      { from: web3.eth.accounts[1], value: web3.toWei(0.1, "ether") }
    ));
  }
  callback();
}

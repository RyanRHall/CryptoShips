pragma solidity ^0.4.25;

import "./Scholarship.sol";

contract ScholarshipManager {
  string public verificationEndpoint;
  mapping (string => bool) usedVerificationKeys;
  address[] public scholarships;

  constructor(string memory _verificationEndpoint)
    public {
      verificationEndpoint = _verificationEndpoint;
  }

  function create(uint256 daysToComplete, string memory instructions, string memory schoolName, string memory courseName)
    public {
      Scholarship newScholarship = new Scholarship(daysToComplete, instructions, schoolName, courseName);
      scholarships.push(address(newScholarship));
  }

  function getScholarships()
    public
    view
    returns(address[] memory) {
      return scholarships;
  }

  function verificationKeyUsed(string memory key)
    public
    view
    returns(bool){
      return usedVerificationKeys[key];
  }
}

pragma solidity ^0.4.25;

import "./Scholarship.sol";

contract ScholarshipManager {
  mapping (string => bool) usedVerificationKeys;
  address[] public scholarships;
  constructor() public {
  }

  function create(uint256 _daysToComplete, string memory _instructions)
    public {
      Scholarship newScholarship = new Scholarship(_daysToComplete, _instructions);
      scholarships.push(address(newScholarship));
  }

  function getScholarships()
    public
    view
    returns(address[] memory) {
      return scholarships;
  }
}

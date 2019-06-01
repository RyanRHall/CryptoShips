pragma solidity ^0.4.25;

import "./Scholarship.sol";
import "./ScholarshipManagerInterface.sol";

contract ScholarshipManager is ScholarshipManagerInterface {

  /**************************** State ****************************/

  string public testVerificationEndpoint;
  address public oraclizeResolverAddress;
  address admin;
  address[] public scholarshipAddresses;
  mapping (bytes32 => bool) public usedVerificationKeys;
  mapping (address => bool) public activeScholarships;

  /*************************** Events ****************************/

  event scholarshipAdded(address scholarshipAddress);

  /************************** Modifiers **************************/

  modifier adminOnly {
    require(msg.sender == admin); _;
  }
  /************************* Constructor *************************/

  constructor(string memory _testVerificationEndpoint)
    public {
      admin = msg.sender;
      testVerificationEndpoint = _testVerificationEndpoint;
  }

  /************************* Functions ***************************/

  function setOraclizeResolverAddress(address _address)
    public
    adminOnly {
      oraclizeResolverAddress = _address;
    }

  function create(uint256 daysToComplete, string memory schoolName, string memory courseName)
    public
    payable {
      require(msg.value > 0);
      Scholarship newScholarship = (new Scholarship).value(msg.value)(daysToComplete, schoolName, courseName, oraclizeResolverAddress);
      scholarshipAddresses.push(address(newScholarship));
      activeScholarships[address(newScholarship)] = true;
      emit scholarshipAdded(address(newScholarship));
    }

  function getScholarshipAddresses()
    public
    view
    returns(address[] memory) {
      return scholarshipAddresses;
    }

  function isScholarshipActive(address scholarshipAddress)
    public
    view
    returns(bool) {
      return(activeScholarships[scholarshipAddress]);
    }

  function wasVerificationKeyUsed(string memory key)
    public
    view
    returns(bool) {
      return usedVerificationKeys[keccak256(abi.encodePacked(key))];
    }

  function setVerificationKeyUsed(string memory key)
    public {
      // only scholarship contracts can mark keys as used
      require(activeScholarships[msg.sender]);
      usedVerificationKeys[keccak256(abi.encodePacked(key))] = true;
    }

  function testVerificationEndpoint()
    public
    view
    returns(string) {
        return(testVerificationEndpoint);
    }

}

pragma solidity ^0.4.25;

import "./ScholarshipManagerInterface.sol";
import "../external_contracts/oraclizeAPI_0.4.25.sol";
import "../external_contracts/strings.sol";

contract Scholarship is usingOraclize {

  /************************** Libraries **************************/

  using strings for *;

  /**************************** State ****************************/

  address public sponsor;
  address public recipient;
  ScholarshipManagerInterface manager;//address scholarshipManager;
  /* Course Info */
  string public schoolName;
  string public courseName;
  /* Scholarship Info */
  uint public startedOn;
  uint public daysToComplete;
  bool completed;
  mapping (address => string) public applications;
  address[] public applicants;
  string public verificationKey;


  /*************************** Events ****************************/

  event scholarshipVerificationRequestSent(address scholarshipAddress, string verificationKey);
  event scholarshipVerified(address scholarshipAddress, string verificationKey);

  /************************** Modifiers **************************/

  modifier ensureInactive {
    require(!isActive()); _;
  }

  modifier ensureActive {
    require(isActive()); _;
  }

  modifier ensureSentBySponsor {
    require(msg.sender == sponsor); _;
  }

  modifier ensureSentByManager {
    require(msg.sender == address(manager)); _;
  }

  /************************* Constructor *************************/

  constructor(uint256 _daysToComplete, string memory _schoolName, string memory _courseName, address oraclizeResolverAddress)
    payable
    public {
      sponsor = tx.origin; // TODO make argument
      manager = ScholarshipManagerInterface(msg.sender);
      daysToComplete = _daysToComplete;
      schoolName = _schoolName;
      courseName = _courseName;
      if (oraclizeResolverAddress != address(0)) {
        OAR = OraclizeAddrResolverI(oraclizeResolverAddress);
      }
    }

  /************************* Functions *************************/

  function isActive()
    public
    view
    returns(bool) {
      return recipient != address(0) && (now - now % 1 days) - startedOn <= daysToComplete * 1 days;
    }

  function _addressToString()
    private
    view
    returns(string memory) {
      bytes32 value = bytes32(uint256(address(this)));
      bytes memory alphabet = "0123456789abcdef";

      bytes memory str = new bytes(42);
      str[0] = '0';
      str[1] = 'x';
      for (uint i = 0; i < 20; i++) {
          str[2+i*2] = alphabet[uint(value[i + 12] >> 4)];
          str[3+i*2] = alphabet[uint(value[i + 12] & 0x0f)];
      }
      return string(str);
    }

  function applyTo(string memory applicationLink)
    public
    ensureInactive {
      applications[msg.sender] = applicationLink;
      applicants.push(msg.sender);
    }

  function awardTo(address _recipient)
    public
    ensureInactive
    ensureSentBySponsor {
      recipient = _recipient;
      startedOn = now - now % 1 days;
      delete applicants;
    }

  function getApplicants()
    public
    view
    returns(address[]) {
      return applicants;
    }

  function reclaim()
    public
    ensureInactive
    ensureSentBySponsor {
      sponsor.transfer(address(this).balance);
    }

  function claim(string _verificationKey)
    public
    payable {
      require(!manager.wasVerificationKeyUsed(_verificationKey));
      require(recipient == msg.sender);
      require(isActive());
      verificationKey = _verificationKey;
      strings.slice[] memory querySlice = new strings.slice[](7);
      querySlice[0] = "json(".toSlice();
      querySlice[1] = manager.testVerificationEndpoint().toSlice();
      querySlice[2] = "?verificationKey=".toSlice();
      querySlice[3] = verificationKey.toSlice();
      querySlice[4] = "&contractAddress=".toSlice();
      querySlice[5] = _addressToString().toSlice();
      querySlice[6] = ").verified".toSlice();
      string memory query = "".toSlice().join(querySlice);
      oraclize_query("URL", query);
      emit scholarshipVerificationRequestSent(address(this), verificationKey);
    }

  function __callback(bytes32 id, string memory result)
    public {
      /* TODO: require sender == oraclize API */
      require(msg.sender == oraclize_cbAddress());
      // validate result
      require(result.toSlice().equals("true".toSlice()));
      // extract scholarship address and verification key
      /* strings.slice memory resultSlice = result.toSlice();
      string memory scholarshipAddressString = resultSlice.split(":".toSlice()).toString();
      address scholarshipAddress = parseAddr(scholarshipAddressString);
      string memory verificationKey = resultSlice.toString(); */
      // add verification key to storage
      manager.setVerificationKeyUsed(verificationKey);
      // claim scholarship
      recipient.transfer(address(this).balance);
      // emit event
      emit scholarshipVerified(address(this), verificationKey);
    }

}

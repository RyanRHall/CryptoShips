pragma solidity ^0.4.25;

import "../external_contracts/oraclizeAPI_0.4.25.sol";
import "../external_contracts/strings.sol";

contract Scholarship is usingOraclize {
  using strings for *;

  /************************* State *************************/

  address public sponsor;
  address public recipient;
  address scholarshipManager;
  /* Course Info */
  string public schoolName;
  string public courseName;
  /* Scholarship Info */
  string public instructions;
  uint public startedOn;
  uint public daysToComplete;
  bool completed;
  mapping (address => string) public applications;

  // testing
  string public test1;
  string public test2;
  string public test3;

  /************************* Modifiers *************************/

  modifier ensureInactive {
    require(!_active()); _;
  }

  modifier ensureActive {
    require(_active()); _;
  }

  modifier sponsorOnly {
    require(msg.sender == sponsor); _;
  }

  modifier recipientOnly {
    require(msg.sender == recipient); _;
  }

  /************************* Constructor *************************/

  constructor(uint256 _daysToComplete, string memory _instructions, string memory _schoolName, string memory _courseName)
    payable
    public {
      sponsor = tx.origin;
      scholarshipManager = msg.sender;
      instructions = _instructions;
      schoolName = _schoolName;
      courseName = _courseName;
      daysToComplete = _daysToComplete;
  }

  /************************* Functions *************************/

  function addressToString()
    public
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

  function _active()
    private
    view
    returns(bool) {
      return recipient != address(0) && (block.timestamp - startedOn) <= daysToComplete;
  }

  function applyTo(string memory applicationLink)
    public
    ensureInactive {
      applications[msg.sender] = applicationLink;
  }

  function awardTo(address _recipient)
    public
    /* ensureInactive */
    sponsorOnly {
      recipient = _recipient;
      startedOn = block.timestamp;
  }

  function claim(string memory verificationKey)
    payable
    public
    /* ensureActive */
    recipientOnly {
      string memory query =
        /* "json(http://verify.cryptoships.xyz?verificationKey=".toSlice() */
        "json(http://localhost:8080?verificationKey=".toSlice()
        .concat(verificationKey.toSlice()).toSlice()
        .concat("&contractAddress=".toSlice()).toSlice()
        .concat(addressToString().toSlice()).toSlice()
        .concat(").verified".toSlice());
      test1 = query;
      /* oraclize_query("URL", query); */
  }

  function reclaim()
    payable
    public
    ensureInactive
    sponsorOnly {
      sponsor.transfer(address(this).balance);
  }

  function __callback(bytes32 myid, string memory result)
    public {
      test2 = result;
      /* require(msg.sender == oraclize_cbAddress());
      temperature = result;
      emit LogNewTemperatureMeasure(temperature); */
      // Do something with the temperature measure...
  }

}

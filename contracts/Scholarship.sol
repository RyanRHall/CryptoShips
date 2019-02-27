pragma solidity ^0.4.25;

import "../external_contracts/oraclizeAPI_0.4.25.sol";
import "../external_contracts/strings.sol";

contract Scholarship is usingOraclize {

  /************************** Libraries **************************/

    using strings for *;

  /**************************** State ****************************/

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
  address[] public applicants;

  /************************** Modifiers **************************/

  modifier ensureInactive {
    require(!active()); _;
  }

  modifier ensureActive {
    require(active()); _;
  }

  modifier ensureSentBySponsor {
    require(msg.sender == sponsor); _;
  }

  modifier ensureSentByManager {
    require(msg.sender == scholarshipManager); _;
  }

  modifier ensureOriginatesWithRecipient {
    require(tx.origin == recipient); _;
  }

  /************************* Constructor *************************/

  constructor(uint256 _daysToComplete, string memory _instructions, string memory _schoolName, string memory _courseName)
    payable
    public {
      sponsor = tx.origin;
      scholarshipManager = msg.sender;
      daysToComplete = _daysToComplete;
      instructions = _instructions;
      schoolName = _schoolName;
      courseName = _courseName;
  }

  /************************* Functions *************************/

  function active()
    public
    view
    returns(bool) {
      return recipient != address(0) && (now - now % 1 days) - startedOn <= daysToComplete * 1 days;
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
    returns(address[]){
      return applicants;
  }

  function reclaim()
    public
    ensureInactive
    ensureSentBySponsor {
      sponsor.transfer(address(this).balance);
  }

  function payout()
    public
    ensureActive
    ensureSentByManager
    ensureOriginatesWithRecipient {
      recipient.transfer(address(this).balance);
  }

}

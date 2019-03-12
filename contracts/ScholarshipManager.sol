pragma solidity ^0.4.25;

import "./Scholarship.sol";
import "../external_contracts/oraclizeAPI_0.4.25.sol";
import "../external_contracts/strings.sol";

contract ScholarshipManager is usingOraclize  {

  /************************** Libraries **************************/

  using strings for *;

  /**************************** State ****************************/

  string public verificationEndpoint;
  mapping (string => bool) usedVerificationKeys;
  address[] public scholarships;

  /*************************** Events ****************************/

  event scholarshipAdded(address scholarshipAddress);
  event scholarshipVerificationRequestSent(address scholarshipAddress, string verificationKey);
  event scholarshipVerified(address scholarshipAddress, string verificationKey);

  /************************* Constructor *************************/

  constructor(string memory _verificationEndpoint, address oraclizeResolverAddress)
    public {
      verificationEndpoint = _verificationEndpoint;
      if (oraclizeResolverAddress != address(0)) {
        OAR = OraclizeAddrResolverI(oraclizeResolverAddress);
      }
  }

  /************************* Functions ***************************/

  function _addressToString(address scholarship)
    private
    pure
    returns(string memory) {
      bytes32 value = bytes32(uint256(scholarship));
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

  function create(uint256 daysToComplete, string memory instructions, string memory schoolName, string memory courseName)
    public
    payable {
      Scholarship newScholarship = (new Scholarship).value(msg.value)(daysToComplete, instructions, schoolName, courseName);
      scholarships.push(address(newScholarship));
      emit scholarshipAdded(address(newScholarship));
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

  function claim(address scholarshipAddress, string memory verificationKey)
    public
    payable {
      Scholarship scholarship = Scholarship(scholarshipAddress);
      require(!usedVerificationKeys[verificationKey]);
      require(scholarship.recipient() == msg.sender);
      require(scholarship.active());
      emit scholarshipVerificationRequestSent(scholarshipAddress, verificationKey);
      strings.slice[] memory querySlice = new strings.slice[](7);
      querySlice[0] = "json(".toSlice();
      querySlice[1] = verificationEndpoint.toSlice();
      querySlice[2] = "?verificationKey=".toSlice();
      querySlice[3] = verificationKey.toSlice();
      querySlice[4] = "&contractAddress=".toSlice();
      querySlice[5] = _addressToString(scholarshipAddress).toSlice();
      querySlice[6] = ").verified".toSlice();
      string memory query = "".toSlice().join(querySlice);
      oraclize_query("URL", query);
  }

  function __callback(bytes32 myid, string memory result)
    public {
      /* TODO: require sender == oraclize API */
      /* require(msg.sender == oraclize_cbAddress()); */
      // validate result
      require(!result.toSlice().startsWith("false".toSlice()));
      // extract scholarship address and verification key
      strings.slice memory resultSlice = result.toSlice();
      string memory scholarshipAddressString = resultSlice.split(":".toSlice()).toString();
      address scholarshipAddress = parseAddr(scholarshipAddressString);
      string memory verificationKey = resultSlice.toString();
      // emit event
      emit scholarshipVerified(scholarshipAddress, verificationKey);
      // add verification key to storage
      usedVerificationKeys[verificationKey] = true;
      // claim scholarship
      Scholarship scholarship = Scholarship(scholarshipAddress);
      scholarship.payout();
  }

}

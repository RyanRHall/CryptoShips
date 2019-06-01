pragma solidity ^0.4.25;

interface ScholarshipManagerInterface {

  function testVerificationEndpoint()
    public
    view
    returns(string);

  function wasVerificationKeyUsed(string memory key)
    public
    view
    returns(bool);

  function setVerificationKeyUsed(string memory key)
    public;
    
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Token.sol";

struct CrwdSaleDeploymentArgs {
  Token _tokenContractAddress;
}

contract Crowdsale {
  string public name = "Crowdsale";
  Token public tokenContract;

  // Save address to Token Contract
  constructor(CrwdSaleDeploymentArgs memory args) {
    // Integrate tknContract via address assignment
    tokenContract = args._tokenContractAddress;
  }

  function buyTokens(uint256 _amount) public {
    tokenContract.transfer(msg.sender, _amount);
  }
}
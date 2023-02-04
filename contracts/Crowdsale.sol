// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Token.sol";

struct CrwdSaleDeploymentArgs {
  Token _tokenContractAddress;
}

contract Crowdsale {
  string public name = "Crowdsale";
  Token public tknContractAddress;

  // Save address to Token Contract
  constructor(CrwdSaleDeploymentArgs memory args) {
    tknContractAddress = args._tokenContractAddress;
  }
}
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Token.sol";

struct CrwdSaleDeploymentArgs {
  uint256 _price;
  Token _tokenContractAddress;
}

contract Crowdsale {
  string public name = "Crowdsale";
  Token public tokenContract;
  uint256 public price;

  event TokenPurchase(
    uint256 amount,
    address purchaser
  );

  // Save address to Token Contract
  constructor(CrwdSaleDeploymentArgs memory args) {
    // Integrate tknContract via address assignment
    tokenContract = args._tokenContractAddress;
    price = args._price;

  }

  function buyTokens(uint256 _amount) public payable {
    // Provides the correct amount of ETH
    require(msg.value == (_amount / 1e18) * price, 'Sender did not provide the correct amount of ETH');
    // ICO has enough tokens for purchase amount
    require(tokenContract.balanceOf(address(this)) >= _amount, 'Insufficent token balance for purchase amount');
    // ETH is transfered to ICO balance
    require(tokenContract.transfer(msg.sender, _amount), 'Failed to transfer tokens to ICO');

    emit TokenPurchase(_amount, msg.sender);
  }
}
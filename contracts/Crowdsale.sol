// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Token.sol";

struct CrwdSaleDeploymentArgs {
  Token _tokenContractAddress;
  uint256 _maxTokens;
  uint256 _price;
}

contract Crowdsale {
  string public name = "Crowdsale";
  address public owner;
  //
  Token public tokenContract;
  uint256 public maxTokens;
  uint256 public price;
  //
  uint256 public tokensSold;

  event TokenPurchase(
    uint256 amount,
    address purchaser
  );
  event Finalize(
    uint256 tokensSold, uint256 ethRaised
  );

  // Save address to Token Contract
  constructor(CrwdSaleDeploymentArgs memory args) {
    owner = msg.sender;
    // - OR specify some arbitrary address for security
    // Integrate tknContract via address assignment
    tokenContract = args._tokenContractAddress;
    maxTokens = args._maxTokens;
    price = args._price;
  }

  receive() external payable {
    uint256 amount = msg.value / price;
    buyTokens(amount * 1e18);
  }
  // fallback() // ! << See docs

  // TODO - ? UTIL FUNCTIONS IN SOLIDITY ?
  // function tokensRemaining() public {
  //   uint256 balance = tokenContract.balanceOf(address(this));
  //   return (balance);
  // }

  function buyTokens(uint256 _amount) public payable {
    // correct amount of ETH was provided for sale
    require(msg.value == (_amount / 1e18) * price, 'Sender did not provide the correct amount of ETH');
    // ICO has enough tokens for purchase amount
    require(tokenContract.balanceOf(address(this)) >= _amount, 'Insufficent token STOCK balance for purchase amount');
    // transfer ETH to ICO balance
    require(tokenContract.transfer(msg.sender, _amount), 'Failed to transfer tokens to ICO');

    tokensSold += _amount;
    emit TokenPurchase(_amount, msg.sender);
  }

  function  finalize() public {
    require(msg.sender == owner);
    // todo - Confirm dates and parameters
    // Send remaining tokens to creator
    uint256 remainingTokens = tokenContract.balanceOf(address(this));
    require(tokenContract.transfer(owner, remainingTokens));

    // Send ETH to creator
    uint256 ethRaised = address(this).balance;
    // (bool sent, bytes data) =
    ( bool sent, ) = owner.call{ value: ethRaised }("");
    require(sent);

    emit Finalize(tokensSold, ethRaised);
  }
}
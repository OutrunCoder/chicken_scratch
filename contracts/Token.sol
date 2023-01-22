// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

struct DeploymentArgs {
    string _name;
    string _symbol;
    uint256 _decimals;
    uint256 _totalSupply;

}

contract Token {
    string public name; //  = "Scratch";
    string public symbol; // = "SCRATCH";
    uint256 public decimals; // = 18;
    uint256 public totalSupply; // = 1000000 * (10**decimals);

    constructor(DeploymentArgs memory args) {
        name = args._name;
        symbol = args._symbol;
        decimals = args._decimals;
        // totalSupply = args._totalSupply;
        totalSupply = args._totalSupply * (10**decimals); // << in decimals
    }
}

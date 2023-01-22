import { ethers } from "hardhat";
import { expect } from 'chai';

describe('Token', () => {
  it('Has a name', async () => {
    // Check that name is correct
    // Fetch token
    const TokenContract = await ethers.getContractFactory('Token');
    let token = await TokenContract.deploy();
    // Read name
    const name = await token.name();
    // validate
    expect(name).to.equal('Scratch');
  });
});
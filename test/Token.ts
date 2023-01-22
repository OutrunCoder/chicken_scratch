import { ethers } from "hardhat";
import { expect } from 'chai';

describe('Token', () => {
  let token: any;

  beforeEach(async() => {
    // Fetch token
    const TokenContract = await ethers.getContractFactory('Token');
    token = await TokenContract.deploy();
  });

  it('Has correct name', async () => {
    expect(await token.name()).to.equal('Scratch');
  });

  it ('Has correct symbol', async () => {
    expect(await token.symbol()).to.equal('SCRATCH');
  });
});
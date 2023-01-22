import { ethers } from "hardhat";
import { expect } from 'chai';

const parseTokenSupply = (nString: string) => {
  return ethers.utils.parseUnits(nString.toString(), 'ether');
};

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

  it ('Has correct decimals', async () => {
    expect(await token.decimals()).to.equal('18');
  });

  it ('Has correct total Supply', async () => {
    // const supplyLimit = parseTokenSupply('1000000');
    expect(await token.totalSupply()).to.equal(parseTokenSupply('1000000'));
  });
});
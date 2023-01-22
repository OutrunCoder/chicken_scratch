import { ethers } from "hardhat";
import { expect } from 'chai';

const parseTokenSupply = (nString: string) => {
  return ethers.utils.parseUnits(nString.toString(), 'ether');
};

describe('Token:', () => {
  let token: any;

  const name: string = 'Scratch';
  const symbol: string = 'SCRATCH';
  const decimals: number = 18;
  const totalSupply: number = 1000000;

  beforeEach(async() => {
    const TokenContract = await ethers.getContractFactory('Token');
    token = await TokenContract.deploy({
      _name: name,
      _symbol: symbol,
      _decimals: decimals,
      _totalSupply: totalSupply
    });
  });

  describe('Deployment:', () => {
    it('Has correct name', async () => {
      expect(await token.name()).to.equal(name);
    });
  
    it ('Has correct symbol', async () => {
      expect(await token.symbol()).to.equal(symbol);
    });
  
    it ('Has correct decimals', async () => {
      expect(await token.decimals()).to.equal(decimals);
    });
  
    it ('Has correct total Supply', async () => {
      expect(await token.totalSupply()).to.equal(parseTokenSupply(totalSupply.toString()));
    });
  });

  // Describe Spending:

  // Describe approving:

  // Describe ...

});
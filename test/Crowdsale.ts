import { ethers } from 'hardhat';
import { expect } from 'chai';
// import Convert from '../utils/token-conversion';

describe('Crowdsale', () => {
  let crowdsaleContract: any;
  let tokenContract: any;
  
  beforeEach(async() => {
    const crwdSaleContractFactory = await ethers.getContractFactory('Crowdsale');
    const tknContractFactory = await ethers.getContractFactory('Token');

    tokenContract = await tknContractFactory.deploy({
      _name: 'Chicken Scratch',
      _symbol: 'SCRATCH',
      _decimals: 18,
      _totalSupply: 1000000
    });

  });

  describe('Deployment', () => {
    it('Has correct name', async() => {
      expect(await crowdsaleContract.name()).to.equal('Crowdsale');
    });
  });
})
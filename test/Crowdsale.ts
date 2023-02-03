import { ethers } from 'hardhat';
import { expect } from 'chai';
// import Convert from '../utils/token-conversion';

describe('Crowdsale', () => {
  let crowdsaleContract: any;
  
  beforeEach(async() => {
    const contractFactory = await ethers.getContractFactory('Crowdsale');
    crowdsaleContract = await contractFactory.deploy();
  });

  describe('Deployment', () => {
    it('Has correct name', async() => {
      expect(await crowdsaleContract.name()).to.equal('Crowdsale');
    });
  });
})
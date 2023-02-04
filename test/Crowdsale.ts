import { ethers } from 'hardhat';
import { expect } from 'chai';
import Convert from '../utils/token-conversion';

describe('Crowdsale', () => {
  let tokenTotalSupply: number = 1000000;
  let tokenTotalSupplyInWei: any = Convert.TokensToWei(tokenTotalSupply.toString());
  //
  let crowdsaleContract: any;
  let tokenContract: any;
  //
  let accounts: Array<any>;
  let deployer: any;
  
  beforeEach(async() => {
    // Load contracts
    const crwdSaleContractFactory = await ethers.getContractFactory('Crowdsale');
    const tknContractFactory = await ethers.getContractFactory('Token');

    // A
    tokenContract = await tknContractFactory.deploy({
      _name: 'Chicken Scratch',
      _symbol: 'SCRATCH',
      _decimals: 18,
      _totalSupply: tokenTotalSupply
    });

    // B
    crowdsaleContract = await crwdSaleContractFactory.deploy({
      _tokenContractAddress: tokenContract.address
    });

    // Collect Accounts
    accounts = await ethers.getSigners();
    // ACTORS
    [
      deployer,
    ] = accounts;

    // xfer tokens to ICO
    const tokenHandoff = await tokenContract.connect(deployer).transfer(crowdsaleContract.address, tokenTotalSupplyInWei);
    await tokenHandoff.wait();
  });

  describe('Deployment', () => {
    it('has correct name', async() => {
      expect(await crowdsaleContract.name()).to.equal('Crowdsale');
    });

    it('sends tokens to the Crowdsale contract', async() => {
      const initialCrwdSaleTknBalance = tokenContract.balanceOf(crowdsaleContract.address);
      expect(await initialCrwdSaleTknBalance).to.equal(tokenTotalSupplyInWei);
    });

    it('returns the Token address', async () => {
      expect(await crowdsaleContract.tokenContract()).to.equal(tokenContract.address);
    });
  });
    });
  });
})
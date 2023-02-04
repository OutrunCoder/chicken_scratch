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
  let user1: any;
  //
  let deployerAddress: string;
  let user1Address: string;
  let tknContractAddress: string;
  let crwdContractAddress: string;
  
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
    tknContractAddress = tokenContract.address;

    // B
    crowdsaleContract = await crwdSaleContractFactory.deploy({
      _tokenContractAddress: tokenContract.address
    });
    crwdContractAddress = crowdsaleContract.address;

    // Collect Accounts
    accounts = await ethers.getSigners();
    // ACTORS
    [
      deployer,
      user1
    ] = accounts;
    user1Address = user1.address;

    // xfer tokens to ICO
    const tokenHandoff = await tokenContract.connect(deployer).transfer(crwdContractAddress, tokenTotalSupplyInWei);
    await tokenHandoff.wait();
  });

  describe('Deployment', () => {
    it('has correct name', async() => {
      expect(await crowdsaleContract.name()).to.equal('Crowdsale');
    });

    it('sends tokens to the Crowdsale contract', async() => {
      const initialCrwdSaleTknBalance = tokenContract.balanceOf(crwdContractAddress);
      expect(await initialCrwdSaleTknBalance).to.equal(tokenTotalSupplyInWei);
    });

    it('returns the Token address', async () => {
      expect(await crowdsaleContract.tokenContract()).to.equal(tknContractAddress);
    });
  });

  describe('Buying Tokens', () => {
    const purchaseQty = Convert.TokensToWei('10');

    describe('success', () => {
      it('transfers tokens', async () => {
        const trx = await crowdsaleContract.connect(user1).buyTokens(purchaseQty);
        await trx.wait();

        expect(await tokenContract.balanceOf(crwdContractAddress)).of.equal(Convert.TokensToWei('999990'));
        expect(await tokenContract.balanceOf(user1Address)).of.equal(purchaseQty);
      });
    });
  });
})
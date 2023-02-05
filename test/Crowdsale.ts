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
    const tknContractFactory = await ethers.getContractFactory('Token');
    const crwdSaleContractFactory = await ethers.getContractFactory('Crowdsale');

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
      _tokenContractAddress: tknContractAddress,
      _price: Convert.TokensToWei('.005') // ! REQUIRES PRICE ADJUSTMENTS BELOW >>>
    });
    crwdContractAddress = crowdsaleContract.address;

    // Collect Accounts
    accounts = await ethers.getSigners();
    // ACTORS
    [
      deployer,
      user1
    ] = accounts;
    deployerAddress = deployer.address;
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
    let trx: any;
    // let trxResult: any;
    // ! PRICE ADJUST HERE
    const purchaseAmount = Convert.TokensToWei('10');
    const purchasePrice_ETH = Convert.TokensToWei('.05');

    describe('Success', () => {
      beforeEach(async() => {
        trx = await crowdsaleContract.connect(user1).buyTokens(purchaseAmount, { value: purchasePrice_ETH });
        // trxResult =
        await trx.wait();
      });

      it('transfers tokens', async () => {

        expect(await tokenContract.balanceOf(crwdContractAddress)).of.equal(Convert.TokensToWei('999990'));
        expect(await tokenContract.balanceOf(user1Address)).of.equal(purchaseAmount);
      });

      it('updates contracts ether balance', async () => {
        const crwdSaleContractEthersBalance = await ethers.provider.getBalance(crwdContractAddress);
        expect(crwdSaleContractEthersBalance).to.equal(purchasePrice_ETH);
      })

      it('emits a purchase event', async() => {
        // console.log('>> PURCHASE:\n', trxResult.events[1].args);
        // DOCS - https://hardhat.org/hardhat-chai-matchers/docs/reference#.emit
        await expect(trx).to.emit(crowdsaleContract, 'TokenPurchase')
          .withArgs(purchaseAmount, user1Address);
      });
    });

    describe('Failure', () => {
      it('rejects incorrect ETH provided', async () => {
        const badTrx = crowdsaleContract.connect(user1).buyTokens(purchaseAmount, { value: 0 });
        // badTrx => js exception try/catch required to asses result
        await expect(badTrx).to.be.reverted;
      });

      it('rejects insufficient TOKEN stock for purchase amount requested', async() => {
        // DRAIN ICO STOCK
        // ! PRICE ADJUST HERE
        const firstPurchaseAmount = Convert.TokensToWei('999999');
        const firstPurchasePrice_ETH = Convert.TokensToWei('4999.995');
        await crowdsaleContract.connect(deployer).buyTokens(firstPurchaseAmount, { value: firstPurchasePrice_ETH });

        // console.log('>> ICO BALANCE:', Convert.WeiToTokens(await tokenContract.balanceOf(crwdContractAddress)));

        // TOO LATE -  NO MORE LEFT
        const overreachAmount = Convert.TokensToWei('2');
        const overreachPrice_ETH = Convert.TokensToWei('.01');
        const overreachTrx = crowdsaleContract.connect(user1).buyTokens(overreachAmount, { value: overreachPrice_ETH});
        await expect(overreachTrx).to.be.reverted;
      });
    });
  });
})
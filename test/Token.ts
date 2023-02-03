import { ethers } from 'hardhat';
import { expect } from 'chai';
import Convert from '../utils/token-conversion';
import { testTransferEvent } from './utils/test-transfer-event';



describe('Token:', () => {
  const name: string = 'Scratch';
  const symbol: string = 'SCRATCH';
  const decimals: number = 18;
  const totalSupply: number = 1000000;

  //

  let token: any;
  let accounts: any;
  const bogusAddress = '0x0000000000000000000000000000000000000000';
  //
  let deployer: any;
  let deployerAddress: string;
  //
  let receiver: any;
  let receiverAddress: string;
  //
  let exchange: any;
  let exchangeAddress: string;

  //

  let transferAmount: any;
  let transaction: any;
  let result: any;

  beforeEach(async() => {
    const TokenContract = await ethers.getContractFactory('Token');
    token = await TokenContract.deploy({
      _name: name,
      _symbol: symbol,
      _decimals: decimals,
      _totalSupply: totalSupply
    });

    // ACCOUNTS
    accounts = await ethers.getSigners();
    // DESTRUCTURE ACTORS
    [
      deployer,
      receiver,
      exchange
    ] = accounts;
    // COLLECT ACTOR ADDRESSES
    deployerAddress = deployer.address;
    receiverAddress = receiver.address;
    exchangeAddress = exchange.address;
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
      expect(await token.totalSupply()).to.equal(Convert.TokensToWei(totalSupply.toString()));
    });

    //

    it ('Assigns total supply to deployer', async () => {
      expect(await token.balanceOf(deployerAddress)).to.equal(Convert.TokensToWei(totalSupply.toString()));
    });
  });

  describe('Sending Tokens', () => {
    describe('Success', () => {
      beforeEach(async () => {
        // console.log(`\n\n>> BEFORE:`);
        // console.table({
        //   deployer: {
        //     // address: deployerAddress,
        //     balance: await WeiToTokens(await token.balanceOf(deployerAddress))
        //   },
        //   receiver: {
        //     // address: receiverAddress,
        //     balance: await WeiToTokens(await token.balanceOf(receiverAddress))
        //   }
        // });
    
        // TOKENS EXCHANGE
        transferAmount = Convert.TokensToWei('102');
        transaction = await token.connect(deployer).transfer(receiverAddress, transferAmount);
        result = await transaction.wait();
        console.log('\n\n<<< TOKENS EXCHANGED ! <<<');
      });
    
      it('Transfers token balances', (async () => {
        // Check balances after
        const deployerHasRemaining = await token.balanceOf(deployerAddress);
        const receiverHas = await token.balanceOf(receiverAddress);
        console.log(`\n\n>> AFTER:`);
        console.table({
          deployer: {
            // address: deployerAddress,
            balance: Convert.WeiToTokens(deployerHasRemaining)
          },
          receiver: {
            // address: receiverAddress,
            balance: Convert.WeiToTokens(receiverHas)
          }
        });
        
        //Ensure that tokens were transfered (balances changed)
        const remainingExpected = Convert.TokensToWei('999898');
        expect(deployerHasRemaining).to.equal(remainingExpected);
        expect(receiverHas).to.equal(transferAmount);
      }));

      it('Emits a "Transfer" event', async () => {
        const events = result.events;
        const transferEvents = events.filter((e: any) => e.event === 'Transfer');        

        const transferIsValid = testTransferEvent({
          transferEvents,
          fromAddress: deployerAddress,
          toAddress: receiverAddress,
          transferAmount
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(transferIsValid).to.be.true;
      });
    });
      
    describe('Exceptions', () => {
      it('rejects insufficient balances', async() => {
        // Transfer more tokens than deployer has - 10M
        transferAmount = Convert.TokensToWei('100000000'); // INVALID AMOUNT
        await expect(token.connect(deployer).transfer(receiverAddress, transferAmount)).to.be.reverted;
        
        console.log('\n\n<<< EXCESSIVE TOKENS REQ SENT ! <<<\n');
      });
      
      // ! Rejects Invalid receiver
      it('rejects invalid recipient', async() => {
        transferAmount = Convert.TokensToWei('102'); // VALID AMOUNT
        await expect(token.connect(deployer).transfer(bogusAddress, transferAmount)).to.be.reverted;
        
        console.log('\n\n<<< INVALID RECIPIENT REQ SENT ! <<<\n');
      });
    });
  });

  describe('Approving Tokens', () => {
    let owner: string;
    let spender: string;
    
    beforeEach(async () => {
      owner = deployerAddress;
      spender = exchangeAddress;
      transferAmount = Convert.TokensToWei('103');
      
      transaction = await token.connect(deployer).approve(spender, transferAmount);
      result = await transaction.wait();
    });
    
    describe('Success', () => {
      it('allocates an allowance for delegated token spending', async() => {
        expect(await token.allowance(owner, spender)).to.equal(transferAmount);
      });

      it('Emits an "Approval" event', async () => {
        const events = result.events;
        const foundApprovalEvents = events.filter((e: any) => e.event === 'Approval');
    
        // console.log('>> FOUND_XFER_EVENTS:', foundTransferEvents);
        
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(foundApprovalEvents).to.not.be.empty
        //
        const eventArgs = foundApprovalEvents[0].args;
        expect(eventArgs.owner).to.equal(owner);
        expect(eventArgs.spender).to.equal(spender);
        expect(eventArgs.value).to.equal(transferAmount);
      });
    });
    
    describe('Exceptions', () => {
      it('Rejects invalid spenders', async() => {
        await expect(token.connect(deployer).approve(bogusAddress, transferAmount)).to.be.reverted;
      });
    });
  });

  describe('Delegated Token Transfers', () => {
    
    beforeEach(async () => {
      // DEPLOYER APPROVES
      transferAmount = Convert.TokensToWei('104');
      
      transaction = await token.connect(deployer).approve(exchangeAddress, transferAmount);
      result = await transaction.wait();
    });

    describe('Success', () => {
      beforeEach(async () => {
        // EXCHANGE TRANSFERS ON BEHALF
        transaction = await token.connect(exchange).transferFrom(deployerAddress, receiverAddress, transferAmount);
        result = await transaction.wait();
      });

      it('Transfers token balances', async() => {
        expect(await token.balanceOf(deployerAddress)).to.be.equal(Convert.TokensToWei('999896'));
        expect(await token.balanceOf(receiverAddress)).to.be.equal(transferAmount);
      });

      it('Resets the allowance', async() => {
        expect(await token.allowance(deployerAddress, exchangeAddress)).to.be.equal(0);
      });

      it('Emits a "Transfer" event', async () => {
        const events = result.events;
        const transferEvents = events.filter((e: any) => e.event === 'Transfer');
    
        const transferIsValid = testTransferEvent({
          transferEvents,
          fromAddress: deployerAddress,
          toAddress: receiverAddress,
          transferAmount
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(transferIsValid).to.be.true;
      });
    });

    describe('Exceptions', () => {
      it('Rejects insufficient amounts', async () => {
        const invalidAmount = Convert.TokensToWei('100000000');
        await expect(token.connect(exchange).transferFrom(deployerAddress, receiverAddress, invalidAmount)).to.be.reverted;
      })
    });
  });
});
import { ethers } from "hardhat";
import { expect } from 'chai';

const TokensToWei = (nString: string) => {
  // 1 => 1000000000000000000
  return ethers.utils.parseUnits(nString.toString(), 'ether');
};
const WeiToTokens = (bigNumber: any) => {
  // 1000000000000000000 => 1  
  return ethers.utils.formatEther(bigNumber);
};

describe('Token:', () => {
  const name: string = 'Scratch';
  const symbol: string = 'SCRATCH';
  const decimals: number = 18;
  const totalSupply: number = 1000000;

  let token: any;
  let accounts: any;
  let deployer: any;
  let deployerAddress: string;
  let receiver: any;
  let receiverAddress: string;

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
    // DEPLOYER
    deployer = accounts[0];
    deployerAddress = deployer.address;
    // RECEIVER
    receiver = accounts[1];
    receiverAddress = receiver.address;
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
      expect(await token.totalSupply()).to.equal(TokensToWei(totalSupply.toString()));
    });

    //

    it ('Assigns total supply to deployer', async () => {
      expect(await token.balanceOf(deployerAddress)).to.equal(TokensToWei(totalSupply.toString()));
    });
  });

  describe('Sending Tokens', () => {
    let transferAmount: any;
    let transaction: any;
    let result: any;
    
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
        transferAmount = TokensToWei('100');
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
            balance: WeiToTokens(deployerHasRemaining)
          },
          receiver: {
            // address: receiverAddress,
            balance: WeiToTokens(receiverHas)
          }
        });
        
        //Ensure that tokens were transfered (balances changed)
        const remainingExpected = TokensToWei('999900');
        expect(deployerHasRemaining).to.equal(remainingExpected);
        expect(receiverHas).to.equal(transferAmount);
      }));
    
      it('Emits a Transfer event', async () => {
        const events = result.events;
        const foundTransferEvents = events.filter((e: any) => e.event === 'Transfer');
    
        // console.log('>> FOUND_XFER_EVENTS:', foundTransferEvents);
        
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(foundTransferEvents).to.not.be.empty
        //
        const eventArgs = foundTransferEvents[0].args;
        expect(eventArgs.from).to.equal(deployerAddress);
        expect(eventArgs.to).to.equal(receiverAddress);
        expect(eventArgs.value).to.equal(transferAmount);
      });
    });
      
    describe('Exceptions', () => {
      it('rejects insufficient balances', async() => {
        // Transfer more tokens than deployer has - 10M
        transferAmount = TokensToWei('100000000'); // INVALID AMOUNT
        await expect(token.connect(deployer).transfer(receiverAddress, transferAmount)).to.be.reverted;
        
        console.log('\n\n<<< EXCESSIVE TOKENS REQ SENT ! <<<\n');
      });
      
      // ! Rejects Invalid receiver
      it('rejects invalid recipient', async() => {
        transferAmount = TokensToWei('100'); // VALID AMOUNT
        const bogusAddress = '0x0000000000000000000000000000000000000000';
        await expect(token.connect(deployer).transfer(bogusAddress, transferAmount)).to.be.reverted;
        
        console.log('\n\n<<< INVALID RECIPIENT REQ SENT ! <<<\n');
      });
    });
  });

  // Describe approving:

  // Describe ...

});
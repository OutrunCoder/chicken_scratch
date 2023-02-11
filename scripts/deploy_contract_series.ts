import { ethers } from "hardhat";
import Convert from "../utils/token-conversion";
// STAGE 0
// - accept custom params - via main

// - establish a deployment series config w/ meta
export const tokenTotalSupply = 1000000;
export const tokenTotalSupplyInWei = Convert.TokensToWei(tokenTotalSupply.toString());
export const contractConfigs: any = {
  'TOKEN_ASSET_MANAGER': {
    fileName: 'Token',
    _name: 'Chicken Scratch',
    _symbol: 'SCRATCH',
    _decimals: 18,
    _totalSupply: tokenTotalSupply
  },
  'ICO_SALE_MANAGER': {
    fileName: 'Crowdsale',
    _name: 'Crowdsale',
    // _tokenContractAddress: 'TBD', // !
    // _maxTokens: tokenTotalSupply,
    _maxTokens: ethers.utils.parseUnits('1000000', 'ether'), // NOTE - FROM VIDEO DEMONSTRATED <<
    _price: Convert.TokensToWei('.005')
  }
};
//

// TODO -  find type
const generateContract = async(target: string, supplementConfig: any): Promise<any> => {
  let targetConfig = contractConfigs[target];
  if (supplementConfig) {
    targetConfig = {
      ...targetConfig,
      ...supplementConfig
    }
  }
  const contractFactory = await ethers.getContractFactory(targetConfig.fileName);
  
  console.log(`>> DEPLOYING: ${target} >>`);
  console.table(targetConfig);
  const contract = await contractFactory.deploy(targetConfig);
  await contract.deployed();
  return contract;
};

async function main(): Promise<void> {
  // STAGE 1 - DEPLOY TOKEN
  const tokenContract = await generateContract('TOKEN_ASSET_MANAGER', null);
  console.log(`>> TOKEN ASSET MANAGER DEPLOYED TO: ${tokenContract.address}\n`);
  
  // STAGE 2 - DEPLOY ICO
  const crowdsaleContract = await generateContract('ICO_SALE_MANAGER', {
    _tokenContractAddress: tokenContract.address
  });
  console.log(`>> ICO SALE MANAGER DEPLOYED TO: ${crowdsaleContract.address}\n`);

// STAGE 3 - INITIALIZE SALE
  const saleInitialization = await tokenContract.transfer(crowdsaleContract.address, tokenTotalSupplyInWei);
  await saleInitialization.wait();

  console.log('>> SCRATCH SALE HAS STARTED! BA-GOK!!!', await tokenContract.balanceOf(crowdsaleContract.address));
  console.log('>> WITH MAX_TOKENS!!!', await crowdsaleContract.maxTokens());
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// TODO - create/add documentation
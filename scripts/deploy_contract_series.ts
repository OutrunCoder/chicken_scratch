import { ethers } from "hardhat";
import Convert from "../utils/token-conversion";
// STAGE 0
// - accept custom params - via main


// - establish a deployment series config w/ meta
export const tokenTotalSupply = 1000000;
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
    _maxTokens: tokenTotalSupply,
    _price: Convert.TokensToWei('.005')
  }
};
//
const deploymentSchedule = {
  stages: [
    'DEPLOY-TOKEN_ASSET_MANAGER',
    'DEPLOY-ICO_SALE_MANAGER-PULL_PREV_ADDRESS',
    'INITIALIZE-ICO_SALE'
  ]
}

// TODO -  find type
const generateContract = async(target: any): Promise<any> => {
  const targetConfig = contractConfigs[target];
  const contractFactory = await ethers.getContractFactory(targetConfig.fileName);
  const contract = await contractFactory.deploy(targetConfig);
  await contract.deployed();
  return contract;
};

// STAGE 1
// - collect contract configs
const deploymentReport = deploymentSchedule.stages.reduce((finalized, currentStage) => {
  // - reduce on stage serries
  let contract;
  const [action, target, subAction] = currentStage.split('-');

  if (action === 'DEPLOY') {
    // - Deploy w/ config params

  }
  if (action === 'INITIALIZE') {

  }
  // - confirm address via console

  // continue
  // return {
  //   ...deployed,
  //   [deploying.type]: {
  //     ...deploying,
  //     contract
  //   } 
  // }
}, {});

  // next...
// STAGE 3
// - Call Business logic on contracts if required
// - confirm business logic has been executed

// - create shell script
// - create/add documentation
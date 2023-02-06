import Convert from "../utils/token-conversion";
// STAGE 0
// - accept custom params - via main


// - establish a deployment series config w/ meta
export const tokenTotalSupply = 1000000;
export const deploymentConfig = {
  contractConfigs: [
    {
      type: 'token_asset_manager',
      _name: 'Chicken Scratch',
      _symbol: 'SCRATCH',
      _decimals: 18,
      _totalSupply: tokenTotalSupply
    },
    {
      type: 'ICO_sale_manager',
      _name: 'Crowdsale',
      _tokenContractAddress: 'TBD', // !
      _maxTokens: tokenTotalSupply,
      _price: Convert.TokensToWei('.005')
    }
  ]
}


// STAGE 1
// - map on config serries
  // - collect contract
  // - Deploy w/ config params
  // - confirm address via console
  // next...
// STAGE 3
// - Call Business logic on contracts if required
// - confirm business logic has been executed

// - create shell script
// - create/add documentation
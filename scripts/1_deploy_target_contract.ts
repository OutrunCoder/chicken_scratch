// ! DYNAMIC DEPLOYMENT OF TARGET CONTRACT - W2 Token Contract Creation
// First working implementation of contract deployment
// DOCS - https://hardhat.org/hardhat-runner/docs/getting-started#connecting-a-wallet-or-dapp-to-hardhat-network

import { ethers } from "hardhat";

const DEPLOYMENT_TARGET = 'Token';

async function main(): Promise<void> {
  // - Fetch contract deployment target
  const Contract = await ethers.getContractFactory(DEPLOYMENT_TARGET);

  // - Deploy contract
  const migrated = await Contract.deploy({
    _name: 'Scratch',
    _symbol: "SCRATCH",
    _decimals: 18,
    _totalSupply: 1000000
  });
  await migrated.deployed();

  // - Print result
  console.log('\n\n>> CONTRACT DEPLOYED!');
  console.table({ address: migrated.address });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
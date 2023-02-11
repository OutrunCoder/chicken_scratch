
// FW
import { useEffect, useState } from 'react';

// assets
import './App.css';
import logo from './logo.svg';

// libs
import { Container } from 'react-bootstrap';
import { ethers } from 'ethers';

// components
import Navigation from './components/navigation';
import Info from './components/info';
import LoadingStatus from './components/loading-status';
import Progress from './components/progress';

// ABIs
import TOKEN_ABI from './web3-config/abis/Token.json';
import CROWDSALE_ABI from './web3-config/abis/Crowdsale.json';

// contract addresses
import contractConfigs from './web3-config/contracts.json';

function App() {

  const networkConfig = contractConfigs['31337'];
  const { token: tknConfig, crowdsale: crwdSacrwdSlConfig } = networkConfig;

  // console.log('>> WORKING CONFIGS:');
  // console.table({tknConfig, crwdSacrwdSlConfig});
  
  // !  STATE MANAGEMENT
  const [provider, setProvider] = useState(null);
  const [crowdContract, setCrowdContract] = useState(null);
  //
  const [account, setAccount] = useState(null);
  const [accountBalance, setAccountBalance] = useState(0);
  //
  const [price, setPrice] = useState(0);
  const [maxTokens, setMaxTokens] = useState(0);
  const [tokensSold, setTokensSold] = useState(0);
  // 
  const [isLoading, setIsLoading] = useState(true);

  const loadBlockchainData = async () => {
    // Initiate provider
    const _provider = new ethers.providers.Web3Provider(window.ethereum);
    // console.log('>> PROVIDER:', _provider);
    setProvider(_provider);

    // Initiate contracts
    const tokenContract = new ethers.Contract(tknConfig.address, TOKEN_ABI, _provider);
    const crowdsaleContract = new ethers.Contract(crwdSacrwdSlConfig.address, CROWDSALE_ABI, _provider);
    setCrowdContract(crowdsaleContract);
    // console.log('>> TOKEN CONTRACT:', tokenContract);

    // Collect Account
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'});
    const userAccountAddress = ethers.utils.getAddress(accounts[0]);
    // console.log('>> USER ACCOUNT ADDRESS:', userAccountAddress);

    // ! CURRENT USER
    const accountBalance = ethers.utils.formatUnits(await tokenContract.balanceOf(userAccountAddress), 18);
    // console.log('>> USER HAS THIS MANY TOKENS:', accountBalance);
    setAccount(userAccountAddress);
    setAccountBalance(accountBalance);

    // ICO STATE DETAILS
    setPrice(ethers.utils.formatUnits(await crowdsaleContract.price(), 18));
    setMaxTokens(ethers.utils.formatUnits(await crowdsaleContract.maxTokens(), 18));
    setTokensSold(ethers.utils.formatUnits(await crowdsaleContract.tokensSold(), 18));

    // DONE !
    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData();
    }
  }, [isLoading]);

  return (
    <Container>
      <div className="App">
        <header className="App-header">

          <Navigation/>

          <h1 className='my-4'>Introducing Chicken Scratch! Ba-gok!!!</h1>

          {isLoading ? (
            <LoadingStatus/>
          ) : (
            <>
              <p><strong>Current Price:</strong> {price} ETH</p>
              <Progress maxTokens={maxTokens} tokensSold={tokensSold}/>
            </>
          )} 

          {account && (
            <Info account={account} accountBalance={accountBalance}/>
          )}

          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </Container>
  );
}

export default App;


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

// ABIs
import TOKEN_ABI from './web3-config/abis/Token.json';
import CROWDSALE_ABI from './web3-config/abis/Crowdsale.json';

// contract addresses
import contractConfigs from './web3-config/contracts.json';

function App() {

  const networkConfig = contractConfigs['31337'];
  const { token: tknConfig, crowdsale: crwdSacrwdSlConfig } = networkConfig;

  console.log('>> WORKING CONFIGS:');
  console.table({tknConfig, crwdSacrwdSlConfig});
  
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  // 
  const [isLoading, setIsLoading] = useState(true);

  const loadBlockchainData = async () => {
    // Initiate provider
    const _provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log('>> PROVIDER:', _provider);
    setProvider(_provider);

    // Initiate contracts
    const tokenContract = new ethers.Contract(tknConfig.address, TOKEN_ABI, _provider);
    const crowdsaleContract = new ethers.Contract(crwdSacrwdSlConfig.address, CROWDSALE_ABI, _provider);
    // console.log('>> TOKEN CONTRACT:', tokenContract);

    // Set Account
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'});
    const accountAddress = ethers.utils.getAddress(accounts[0]);
    console.log('>> ACCOUTNS:', accountAddress);

    setAccount(accountAddress);

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
          {account && (
            <Info account={account}/>
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

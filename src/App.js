import { useEffect, useState } from 'react';
import './App.css';
import logo from './logo.svg';

import { Container } from 'react-bootstrap';
import { ethers } from 'ethers';

import Navigation from './components/navigation';
import Info from './components/info';

//

//

function App() {

  const [account, setAccount] = useState(null);

  // 

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log('>> PROVIDER:', provider);

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'});
    const accountAddress = ethers.utils.getAddress(accounts[0]);
    console.log('>> ACCOUTNS:', accountAddress);

    setAccount(accountAddress);
  };

  useEffect(() => {
    loadBlockchainData();
  });

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

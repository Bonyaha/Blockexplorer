import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [blockDetails, setBlockDetails] = useState();
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [latestBlocks, setLatestBlocks] = useState();

  /* useEffect(() => {
    async function fetchBlockData() {
      const currentBlockNumber = await alchemy.core.getBlockNumber();
      const block = await alchemy.core.getBlockWithTransactions();
      console.log(currentBlockNumber);
      console.log(block);

      setBlockNumber(currentBlockNumber);
      setBlockDetails(block)
      setTransactions(block.transactions)
    }

    fetchBlockData();
  }, []); */
  useEffect(() => {
    let blockArray = [];
    let transactionArray = [];
    const getLatestBlocks = async () => {
      const currentBlockNumber = await alchemy.core.getBlockNumber();
      setBlockNumber(currentBlockNumber);

      for(let i = 0; i < currentBlock){
        const block = await alchemy.core.getBlock(currentBlockNumber - i)
        blockArray.push(block)
      }
      setLatestBlocks(blockArray);
      console.log("latest blocks: ", latestBlocks);
    }

    getLatestBlocks()
  })

  return (
    <div className="App">
      <h1>Ethereum Block Explorer</h1>
      <div>
        <h2>Current Block Number: {blockNumber}</h2>
        {blockDetails && (
          <div>
            <h3>Block details:</h3>
            <p>Hash: {blockDetails.hash}</p>
            <p>Timestamp: {new Date(blockDetails.timestamp * 1000).toLocaleString()}</p>
            <p>Transactions: {blockDetails.transactions.length}</p>
          </div>
        )}
        <h3>Transactions</h3>
        <ul>
          {transactions.map(tx => (
            <li key={tx.hash} onClick={() => setSelectedTransaction(tx)}>
              Transaction hash: {tx.hash}
            </li>
          )
          )}
        </ul>
        {selectedTransaction && (
          <div>
            <h4>Transaction Details</h4>
            <p>Hash: {selectedTransaction.hash}</p>
            <p>From: {selectedTransaction.from}</p>
            <p>To: {selectedTransaction.to}</p>
            <p>Value: {selectedTransaction.value.toString()} wei</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App;

import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

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
  const [latestBlocks, setLatestBlocks] = useState([]);
  const [latestTransactions, setLatestTranscations] = useState([])

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
    
    const getLatestBlocks = async () => {
      const currentBlockNumber = await alchemy.core.getBlockNumber();
      console.log(currentBlockNumber);
      
      setBlockNumber(currentBlockNumber)

      for (let i = 0; i < 10; i++) {
        const block = await alchemy.core.getBlock(currentBlockNumber - i)
        blockArray.push(block)
      }
      console.log(blockArray);
      
      setLatestBlocks(blockArray);
      
    }
   
    const getLatestTransactions = async () => {
      const block = await alchemy.core.getBlockWithTransactions();
      const latestTransactions = block.transactions.slice(0, 15)
      setLatestTranscations(latestTransactions)
      console.log(latestTransactions);
      
    }

    getLatestBlocks()
    getLatestTransactions()
  },[])

  

  return (
    <div className="App">
      <h1>Ethereum Block Explorer</h1>
      {/* <div>
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
*/}
      <h3>Latest Blocks</h3>
      {latestBlocks.map((block,i)=>(
        <div key={i}>
        <h3>Block<Link to={`/block/${block.number}`}>{block.number}</Link></h3>
        <h3>Fee recipient <Link to={`/address/${block.miner}`}>{block.miner.slice(0,10)}...</Link></h3>
        <h3>Number of transactions: {block.transactions.length}</h3>
        </div>
      ))
      }
      <div>
        <footer>Made by me :) </footer>
      </div>
    </div>
  )
}

export default App;

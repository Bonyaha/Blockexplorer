import { Alchemy, Network, Utils } from 'alchemy-sdk';
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

  useEffect(() => {
    let blockArray = [];

    const getLatestBlocks = async () => {
      try {
        const currentBlockNumber = await alchemy.core.getBlockNumber();
        console.log(currentBlockNumber);

        setBlockNumber(currentBlockNumber)

        const blockPromises = Array.from({ length: 10 }, (_, i) => {
          return alchemy.core.getBlockWithTransactions(currentBlockNumber - i)
        })
        const blocks = await Promise.all(blockPromises)
        console.log(blocks);

        /* const blocksWithRewards = await Promise.all(blocks.map(async (block) => {
          const blockReward = await calculateBlockReward(block)
          return { ...block, reward: blockReward }
        }))

        console.log(blocksWithRewards); */

        setLatestBlocks(blocks);
      }
      catch (error) {
        console.error('Error fetching block data:', error.message);

      }

    }

    const getLatestTransactions = async () => {
      try {
        const block = await alchemy.core.getBlockWithTransactions();
        const latestTransactions = block.transactions.slice(0, 15)
        setLatestTranscations(latestTransactions)
        console.log(latestTransactions);
      }
      catch (error) {
        console.error('Error fetching block data:', error.message);
      }

    }

    const calculateBlockReward = async (block) => {
      let totalTips = 0;
      //console.log('block is recieved: ', block);

      const receiptsPromises = block.transactions.slice(0, 10).map(async (tx) => {
        const receipt = await alchemy.core.getTransactionReceipt(tx.hash)

        const gasUsed = receipt.gasUsed ? Utils.formatUnits(receipt.gasUsed, 'wei') : 0
        const maxPriorityFeePerGas = tx.maxPriorityFeePerGas ? Utils.formatUnits(tx.maxPriorityFeePerGas, 'wei') : 0

        const tip = gasUsed * maxPriorityFeePerGas
        return tip
      })

      const receiptsTips = await Promise.all(receiptsPromises)
      // console.log('receiptsTips are: ', receiptsTips);

      /* receiptsTips.forEach(tip=>{
        totalTips += tip 
    }) */
      totalTips += receiptsTips.reduce((acc, tip) => {
        return acc + tip
      }, 0)
      //console.log('totalTips for block is: ', totalTips);

      return Utils.formatEther(totalTips.toString());

    }

    getLatestBlocks()
    getLatestTransactions()
  }, [])


  return (
    <div className="App">
      <h1>Ethereum Block Explorer</h1>
      {!latestTransactions || !latestBlocks ? (
        <div> Loading... </div>
      ) : (
        <>
          <h3>Latest Blocks</h3>
          {latestBlocks.map((block, i) => (
            <div key={i}>
              <h3>Block<Link to={`/block/${block.number}`}>{block.number}</Link></h3>
              <h3>Fee recipient <Link to={`/address/${block.miner}`}>{block.miner.slice(0, 10)}...</Link></h3>
              <h3>Number of transactions: {block.transactions.length}</h3>
            </div>
          ))
          }
          <h3>Latest Transactions</h3>
          {latestTransactions.map((transaction, i) => (
            <div key={i}>
              <h3>Hash<Link to={`/transaction/${transaction.hash}`}>{transaction.hash.slice(0, 15)}...</Link></h3>
              <h3>From <Link to={`/address/${transaction.from}`}>{transaction.from.slice(0, 10)}...</Link></h3>
              <h3>To: <Link to={`/address/${transaction.to}`}>{transaction.to ? transaction.to.slice(0, 10) + '...' : 'N/A'}</Link></h3>
              <h3>{Utils.formatEther(transaction.value)} ETH</h3>
            </div>
          ))
          }
        </>
      )
      }
      <div>
        <footer>Made by me :) </footer>
      </div>
    </div>
  )


}

export default App;

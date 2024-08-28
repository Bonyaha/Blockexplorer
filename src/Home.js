import alchemy from './alchemyInstance'
import { Utils } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

//import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.



// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface


function App() {  
  const [latestBlocks, setLatestBlocks] = useState();
  const [latestTransactions, setLatestTranscations] = useState([])

  useEffect(() => {
    let blockArray = [];

    const getLatestBlocks = async () => {
      try {
        const currentBlockNumber = await alchemy.core.getBlockNumber();
        console.log(currentBlockNumber);

        //setBlockNumber(currentBlockNumber)

        /* const blockPromises = Array.from({ length: 10 }, async(_, i) => {
          return await alchemy.core.getBlockWithTransactions(currentBlockNumber - i)
        })
        console.log(blockPromises)
        const blocks = await Promise.all(blockPromises)

         const blocksWithRewards = await Promise.all(blocks.map(async (block) => {
          const blockReward = await calculateBlockReward(block.number)
          return { ...block, reward: blockReward }
        }))
 
         //console.log(blocksWithRewards);

        //setLatestBlocks(blocks);
        
        */

        for (let i = 0; i < 10; i++){
          const block = await alchemy.core.getBlock(currentBlockNumber - i);
          console.log(block);
          
          blockArray.push(block);
        }
        
        //console.log(blockArray);

       
        setLatestBlocks(blockArray);

      }
      catch (error) {
        console.error('Error fetching block data:', error.message);

      }

    }

    const getLatestTransactions = async () => {
      try {
        const block = await alchemy.core.getBlockWithTransactions();
        const latestTransactions = block.transactions.slice(0, 10)
        setLatestTranscations(latestTransactions)
        console.log(latestTransactions);
      }
      catch (error) {
        console.error('Error fetching block data:', error.message);
      }

    }

    const calculateBlockReward = async (blockNumber) => {
      /* let totalTips = 0;
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
    }) 
      totalTips += receiptsTips.reduce((acc, tip) => {
        return acc + tip
      }, 0)
      //console.log('totalTips for block is: ', totalTips);

      return Utils.formatEther(totalTips.toString()); */

      try {
        const apiKey = process.env.REACT_APP_ETHERSCAN_API_KEY
        //console.log("Etherscan API Key:", apiKey)
        const response = await axios.get(`https://api.etherscan.io/api`,{
          params: {
            module: 'block',
            action: 'getblockreward',
            blockno: blockNumber,
            apikey: apiKey,
          },
        })
        const blockRewardData = response.data
        /* if (!blockRewardData) {
          throw new Error('Block reward data is undefined or null');
        } */
       console.log(blockRewardData);
       
    
        //const blockRewardEth = Utils.formatEther(blockRewardData)
        //console.log(blockRewardEth)
        return blockRewardData
      }
      catch (error) {
        console.error('Error fetching block reward data:', error.message);
      }
    }

    getLatestBlocks()
    getLatestTransactions()
  }, [])


  return (
    <div className="App container mt-5">
      <div className="d-flex justify-content-between flex-wrap">
        <div className="block-container p-3 flex-grow-1 me-2 mb-3">
        {!latestBlocks ? (
            <div> Loading... </div>
        ) : (
          <>
          <h3>Latest Blocks</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Block</th>
                <th>Fee Recipient</th>
                <th>Transactions</th>               
              </tr>
            </thead>
            <tbody>
              {latestBlocks.map((block, i) => (
                <tr key={i}>
                  <td>
                    <Link to={`/block/${block.number}`}>{block.number}</Link>
                  </td>
                  <td>
                    <Link to={`/address/${block.miner}`}>
                      {block.miner.slice(0, 10)}...
                    </Link>
                  </td>
                  <td>{block.transactions.length}</td>                
                </tr>
              ))}
            </tbody>
          </table>
          </>
        )}
        </div>

        <div className="block-container p-3 flex-grow-1 mb-3">
          <h3>Latest Transactions</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Hash</th>
                <th>From</th>
                <th>To</th>
                <th>Value (ETH)</th>
              </tr>
            </thead>
            <tbody>
              {latestTransactions.map((transaction, i) => (
                <tr key={i}>
                  <td>
                    <Link to={`/transaction/${transaction.hash}`}>
                      {transaction.hash.slice(0, 10)}...
                    </Link>
                  </td>
                  <td>
                    <Link to={`/address/${transaction.from}`}>
                      {transaction.from.slice(0, 10)}...
                    </Link>
                  </td>
                  <td>
                    <Link to={`/address/${transaction.to}`}>
                      {transaction.to ? transaction.to.slice(0, 10) + '...' : 'N/A'}
                    </Link>
                  </td>
                  <td>{Utils.formatEther(transaction.value).slice(0, 10)} ETH</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="text-center mt-5">Made by me :)</footer>
    </div>

  )


}

export default App;

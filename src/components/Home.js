import alchemy from '../alchemyInstance'
import { Utils } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.



// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface

const GasInfo = () => {
  const [ethPrice, setEthPrice] = useState(null);
  const [gasInfo, setGasInfo] = useState({ baseFee: null, priorityFee: null, gas: null })

  useEffect(() => {
    const fetchGasInfo = async () => {
      try {
        const apiKey = process.env.REACT_APP_ETHERSCAN_API_KEY;
        const response = await axios.get(`https://api.etherscan.io/api`, {
          params: {
            module: 'stats',
            action: 'ethprice',
            apikey: apiKey,
          },
        });
        const ethUsd = response.data.result.ethusd;
        const formattedEthPrice = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(ethUsd)

        setEthPrice(formattedEthPrice);

        const currentBlock = await alchemy.core.getBlock('latest');
        const maxPriorityFeePerGas = await alchemy.transact.getMaxPriorityFeePerGas();

        const baseFeePerGas = Utils.formatUnits(currentBlock.baseFeePerGas, 'gwei');
        const priorityFee = Utils.formatUnits(maxPriorityFeePerGas, 'gwei');
        const gas = parseFloat(baseFeePerGas) + parseFloat(priorityFee)

        setGasInfo({
          baseFee: baseFeePerGas,
          priorityFee: priorityFee,
          gas: gas.toFixed(3),
        })

      } catch (error) {
        console.error('Error fetching gas info:', error.message);
      }
    }

    fetchGasInfo()
  }, [])

  return (
    <div className="gas-info-container">
      <div className="eth-price">
        ETH Price: {ethPrice ? ethPrice : 'Loading...'}
      </div>
      <div className="gas-price">
        <i className="fas fa-gas-pump"></i>
        Gas: {gasInfo.gas ? `${gasInfo.gas} Gwei` : 'Loading...'}
        <div className="gas-tooltip">
          <span>Base Fee: {gasInfo.baseFee} Gwei</span>
          <span>Priority Fee: {gasInfo.priorityFee} Gwei</span>
        </div>
      </div>
    </div>

  )
}



function Home() {
  const [latestBlocks, setLatestBlocks] = useState();
  const [latestTransactions, setLatestTranscations] = useState([])
  const [ethPrice, setEthPrice] = useState(null);

  useEffect(() => {
    let blockArray = [];

    const getLatestBlocks = async () => {
      try {
        const currentBlockNumber = await alchemy.core.getBlockNumber();
        console.log(currentBlockNumber);

        //setBlockNumber(currentBlockNumber)        

        for (let i = 0; i < 10; i++) {
          const block = await alchemy.core.getBlock(currentBlockNumber - i);
          //console.log(block);

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
        console.log('latestTransactions are: ', latestTransactions);
      }
      catch (error) {
        console.error('Error fetching block data:', error.message);
      }
    }

    getLatestBlocks()
    getLatestTransactions()
  }, [])

  const formattedEthPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(ethPrice)

  /* console.log('ethPrice: ', ethPrice);
  console.log('latestBlocks: ', latestBlocks);
  console.log('transactions: ', latestTransactions); */



  return (
    <div className="App container">
      <GasInfo />

      <div className="d-flex justify-content-between flex-wrap">

        <div className="block-container p-3 flex-grow-1 me-2 mb-3">
          <h3>Latest Blocks</h3>
          {!latestBlocks ? (
            <div> Loading... </div>
          ) : (
            <>
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
                    <Link to={`/transaction/${transaction.hash}`} state={{ value: transaction.value }}>
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

export default Home;

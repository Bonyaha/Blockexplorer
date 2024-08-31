import { format, formatDistanceToNow } from 'date-fns';
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import alchemy from '../alchemyInstance'
import axios from 'axios';
import { Utils } from 'alchemy-sdk';

const Block = () => {
    const { id } = useParams();
    const [block, setBlock] = useState(null);
    //console.log(id)

    useEffect(() => {
        const getBlock = async () => {
            const block = await alchemy.core.getBlockWithTransactions(parseInt(id))
            const blockReward = await calculateBlockReward(block.number)
            console.log(blockReward);

            const blockWithReward = { ...block, reward: blockReward }
            setBlock(blockWithReward)
        }

        const calculateBlockReward = async (blockNumber) => {
            try {
                const apiKey = process.env.REACT_APP_ETHERSCAN_API_KEY
                //console.log("Etherscan API Key:", apiKey)
                const response = await axios.get(`https://api.etherscan.io/api`, {
                    params: {
                        module: 'block',
                        action: 'getblockreward',
                        blockno: blockNumber,
                        apikey: apiKey,
                    },
                })
                const blockRewardData = response.data.result.blockReward
                /* if (!blockRewardData) {
                  throw new Error('Block reward data is undefined or null');
                } */
                // console.log(blockRewardData);


                const blockRewardEth = Utils.formatEther(blockRewardData)
                console.log(blockRewardEth)
                return blockRewardEth
            }
            catch (error) {
                console.error('Error fetching block reward data:', error.message);
            }
        }
        getBlock()
    }, [id])

    console.log(block)

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp * 1000); // Convert to milliseconds
        const formattedDate = format(date, "MMM-dd-yyyy hh:mm:ss a 'UTC'"); // e.g., Aug-27-2024 05:39:35 AM UTC
        const relativeTime = formatDistanceToNow(date, { addSuffix: true }); // e.g., 1 hr ago

        return `${relativeTime} (${formattedDate})`;
    }

   /*  const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas as thousands separators
    } */

    const calculateGasPercentage = (gasUsed, gasLimit) => {
        return ((gasUsed / gasLimit) * 100).toFixed(2); // Calculate percentage and round to 2 decimal places
    }

    if (!block) {
        return <div>Loading...</div>;
    }
    /* const gasUsedFormatted = formatNumber(block.gasUsed.toString()); */
    const gasUsedFormatted = new Intl.NumberFormat("en-US").format(block.gasUsed)
    const gasLimitFormatted = new Intl.NumberFormat("en-US").format(block.gasLimit);
    const gasPercentage = calculateGasPercentage(block.gasUsed, block.gasLimit)

    return (
        <div className="App container mt-5">
            <h3>Block #{block.number}</h3>
            <Link to={`/block/${block.number - 1}`}>
                <button className="btn btn-primary me-2">Previous Block</button>
            </Link>
            <Link to={`/block/${block.number + 1}`}><button className="btn btn-primary">Next Block</button>
            </Link>

            <table className="table table-striped">
                <thead></thead>
                <tbody>
                    <tr>
                        <td>Block Height:</td>
                        <td className="text-end">{block.number}</td>
                    </tr>
                    <tr>
                        <td>Timestamp:</td>
                        <td className="text-end" >{formatTimestamp(block.timestamp)}</td>
                    </tr>
                    <tr>
                        <td>Gas Used:</td>
                        <td className="text-end">{gasUsedFormatted} ({gasPercentage}%)</td>
                    </tr>
                    <tr>
                        <td>Gas Limit:</td>
                        <td className="text-end">{gasLimitFormatted}</td>
                    </tr>
                    <tr>
                        <td>Fee Recipient:</td>
                        <td className="text-end"><Link to={`/address/${block.miner}`}>{block.miner}</Link></td>
                    </tr>
                    <tr>
                        <td>Block Reward:</td>
                        <td className="text-end">{block.reward} ETH</td>
                    </tr>
                    <tr>
                        <td>Hash:</td>
                        <td className="text-end">{block.hash}</td>
                    </tr>
                    <tr>
                        <td>Parent Hash:</td>
                        <td className="text-end"><Link to={`/block/${block.number - 1}`}>{block.parentHash}</Link></td>
                    </tr>
                    <tr>
                        <td>Transactions:</td>
                        <td className="text-end"><Link to={`/blockTransactions/${block.number}`}><button className="btn btn-outline-secondary">{block.transactions.length} transactions</button></Link></td>
                    </tr>

                </tbody>
                {/* <thead>
              <tr>
                <th>Block Height:</th>
                <th>{block.number}</th>                              
              </tr>
            </thead> */}
            </table>
        </div>
    )
}

export default Block
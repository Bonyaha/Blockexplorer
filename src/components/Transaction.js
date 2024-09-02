import { format, formatDistanceToNow } from 'date-fns';
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import alchemy from '../alchemyInstance'
import axios from 'axios';
import { Utils } from 'alchemy-sdk';


const Transaction = () => {
    const { id } = useParams();
    const [transaction, setTransaction] = useState();
    const [timestamp, setTimestamp] = useState('');
    const [ethPrice, setEthPrice] = useState(0);
    const [value, setValue] = useState();

    //const location = useLocation();
    /* let { state: { value } } = useLocation()
    console.log(value);
    console.log(typeof value); */


    //console.log(Utils.formatEther(value));

    let txFee
    let transactionGasUsed

    useEffect(() => {
        const getTransaction = async () => {
            const transaction = await alchemy.core.getTransactionReceipt(id)
            console.log(transaction);


            setTransaction(transaction)

            const block = await alchemy.core.getBlockWithTransactions(transaction.blockHash)
            //console.log(block)
            const timestamp = block.timestamp
            setTimestamp(timestamp)

            let value

            for (let i = 0; i < block.transactions.length; i++) {
                if (transaction.transactionHash === block.transactions[i].hash) {
                    value = Utils.formatEther(block.transactions[i].value)
                    setValue(value)
                }
            }
        }
        const calculateEthPrice = async () => {
            try {
                const apiKey = process.env.REACT_APP_ETHERSCAN_API_KEY
                //console.log("Etherscan API Key:", apiKey)
                const response = await axios.get(`https://api.etherscan.io/api`, {
                    params: {
                        module: 'stats',
                        action: 'ethprice',
                        apikey: apiKey,
                    },
                })
                const ethUsd = response.data.result.ethusd
                console.log(ethUsd);
                setEthPrice(ethUsd)

            }
            catch (error) {
                console.error('Error fetching block reward data:', error.message);
            }
        }

        getTransaction()
        calculateEthPrice()

        /* if (value !== null) {
            if (typeof value === 'number') {
                setFormattedValue(value);
            } else {
                setFormattedValue(Utils.formatEther(value));
            }
        } else {
            setFormattedValue('0'); // or '0 ETH' depending on how you want to display it
        } */

    }, [id])


    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp * 1000); // Convert to milliseconds
        const formattedDate = format(date, "MMM-dd-yyyy hh:mm:ss a 'UTC'"); // e.g., Aug-27-2024 05:39:35 AM UTC
        const relativeTime = formatDistanceToNow(date, { addSuffix: true }); // e.g., 1 hr ago

        return `${relativeTime} (${formattedDate})`;
    }

    if (transaction) {
        txFee = Utils.formatEther(transaction.gasUsed.mul(transaction.effectiveGasPrice))
        transactionGasUsed = new Intl.NumberFormat("en-US").format(transaction.gasUsed)
    }

    console.log('transaction: ', transaction);

    return (
        <div className="App container mt-5">
            {!transaction ? (
                <div>Loading...</div>
            ) : (
                <>
                    <h3>Transaction #{transaction.transactionHash.slice(0, 12)}...</h3>
                    <table className="table table-striped">
                        <thead></thead>
                        <tbody>
                            <tr>
                                <td className="text-start">Transaction Hash: </td>
                                <td className="text-end">{transaction.transactionHash}</td>
                            </tr>
                            <tr>
                                <td className="text-start">Status: </td>
                                <td className="text-end">
                                    {transaction.status === 1 ? (
                                        <span className="badge bg-success">Success</span>
                                    ) : (
                                        <span className="badge bg-danger">Failed</span>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className="text-start">Block Number: </td>
                                <td className="text-end">
                                    <div className="block-status">
                                        <div className="block-number">
                                            <i className={transaction.confirmations >= 100 ? "fas fa-check-circle finalized-icon" : "fas fa-hourglass-half unfinalized-icon"}></i>
                                            <Link to={`/block/${transaction.blockNumber}`}>{transaction.blockNumber}</Link>
                                            <div className="block-tooltip">
                                                {transaction.confirmations >= 100
                                                    ? "This block is finalized and cannot be reverted without slashing at least 1/3 of all validators' stake."
                                                    : "This block is unfinalized and may be susceptible to reorgs."
                                                }
                                            </div>
                                        </div>
                                        <span className="badge bg-secondary ms-2">
                                            {transaction.confirmations} Block Confirmations
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="text-start">Timestamp: </td>
                                <td className="text-end">{timestamp ? formatTimestamp(timestamp) : "Loading..."}</td>
                            </tr>
                            <tr>
                                <td className="text-start">
                                    From:
                                    <br />
                                    To:
                                </td>
                                <td className="text-end">
                                    <Link to={`/address/${transaction.from}`}>{transaction.from}</Link>
                                    <br />
                                    <Link to={`/address/${transaction.to}`}>{transaction.to}</Link>
                                </td>
                            </tr>
                            <tr>
                                <td className="text-start">Value: </td>
                                <td className="text-end">{value} ETH ({(value * ethPrice).toFixed(2)} USD)</td>
                            </tr>
                            <tr>
                                <td className="text-start">Gas Used: </td>
                                <td className="text-end">{transactionGasUsed}</td>
                            </tr>
                            <tr>
                                <td className="text-start">Gas Price: </td>
                                <td className="text-end">{Utils.formatUnits(transaction.effectiveGasPrice, 'gwei')} Gwei ({Utils.formatEther(transaction.effectiveGasPrice)}) ETH</td>
                            </tr>
                            <tr>
                                <td className="text-start">Transaction Fee:</td>
                                <td className="text-end">{txFee} ETH ({(txFee * ethPrice).toFixed(2)} USD)</td>
                            </tr>
                        </tbody>
                    </table>
                </>
            )}

        </div>
    )
}

export default Transaction
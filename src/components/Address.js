import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import alchemy from '../alchemyInstance'
import { Utils } from 'alchemy-sdk';
import axios from 'axios';

const Address = () => {
    const { id } = useParams();
    const [balance, setBalance] = useState("")
    const [tokens, setTokens] = useState([])
    const [transactions, setTransactions] = useState([])
    const [ethPrice, setEthPrice] = useState(0)


    useEffect(() => {
        const getAddress = async () => {
            const balance = await alchemy.core.getBalance(id, 'latest')
            setBalance(Utils.formatEther(balance))

            const tbalance = await alchemy.core.getTokenBalances(id)
            console.log(tbalance)
            const nonZeroTokenBalance = tbalance.tokenBalances.filter(token => parseInt(token.tokenBalance) !== 0)
            // console.log("nonZero: ", nonZeroTokenBalance)

            let tokensArray = []
            for (let i = 0; i < nonZeroTokenBalance.length; i++) {
                let tokenObj = {}
                let balance = nonZeroTokenBalance[i].tokenBalance
                const metadata = await alchemy.core.getTokenMetadata(nonZeroTokenBalance[i].contractAddress)
                //console.log(metadata);
                //console.log(balance);
                balance = balance / Math.pow(10, metadata.decimals)
                //console.log(balance);

                tokenObj = { name: metadata.name, symbol: metadata.symbol, balance: balance }
                tokensArray.push(tokenObj)
            }

            setTokens(tokensArray);
        }

        const getAllTransactionsFromAddress = async (address) => {
            try {
                //console.log(address);

                const transfers = await alchemy.core.getAssetTransfers({
                    fromBlock: '0x0', // Start from block 0, you can adjust this as needed
                    toBlock: 'latest',
                    fromAddress: address, // The specific address you want to fetch transactions from
                    category: ['external', 'internal', 'erc20', 'erc721', 'erc1155'], // Include all transaction types
                    withMetadata: true, // Include metadata for transactions
                    maxCount: '0x3e8', // Max number of transactions to fetch (0x3e8 = 1000 in hexadecimal)
                    excludeZeroValue: true,
                });

                //console.log(transfers.transfers[1].value.toString().slice(0,10));
                
                setTransactions(transfers.transfers)
                console.log(transfers.transfers[0]);
            } catch (error) {
                console.error('Error fetching transactions:', error);
                return [];
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

        getAddress()
        getAllTransactionsFromAddress(id)
        calculateEthPrice()
    }, [id])

    //console.log("id: ", id);
    //console.log("balance: ", balance);
    //console.log("tokens Array: ", tokens);
   if(transactions){
    console.log(transactions[1])
   }
    

    return (
        <div className="App container mt-5">
            <table className="table table-striped">
                <thead></thead>
                <tbody>
                    <tr>
                        <td>Address:</td>
                        <td className="text-end">{id}</td>
                    </tr>
                    <tr>
                        <td>Balance:</td>
                        <td className="text-end" >{balance.slice(0, 7)} ETH ({(balance * ethPrice).toFixed(2)} USD)</td>
                    </tr>
                </tbody>
            </table>
            <br />
            {!transactions ? (
                <div>Loading...</div>
            ) : (
                <>
                    <h3>Transactions</h3>
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
                            {transactions.map((transaction, i) => (
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
                                    <td>{transaction.value ? transaction.value.toString().slice(0, 10) : 'N/A'} ETH</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
            <h3>Tokens</h3>
            {tokens.length === 0 ? (
                ''
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Symbol</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tokens.map((token, i) => (
                            <tr key={i}>
                                <td>
                                    {token.name}
                                </td>
                                <td>
                                    {token.symbol}
                                </td>
                                <td>{token.balance}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            )}

        </div>
    )

}

export default Address
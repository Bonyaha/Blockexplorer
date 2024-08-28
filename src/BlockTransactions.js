import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import alchemy from './alchemyInstance'
import { Utils } from 'alchemy-sdk';

const BlockTransactions = () => {
    const { id } = useParams()
    const [block, setBlock] = useState()
    console.log(id);

    useEffect(() => {
        const getBlock = async () => {
            const block = await alchemy.core.getBlockWithTransactions(parseInt(id))
            setBlock(block)
        }
        getBlock()
    }, [id])

    console.log(block);

    return (
        <div className="App container mt-5">
            {!block ? (
                <div> Loading... </div>
            ) : (
                <>
                    <h3>All Transactions in Block #{block.number}</h3>
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
                            {block.transactions.map((transaction, i) => (
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
                </>
            )
            }
        </div>
    )

}

export default BlockTransactions
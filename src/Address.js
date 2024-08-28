import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import alchemy from './alchemyInstance'
import { Utils } from 'alchemy-sdk';

const Address = () => {
    const { id } = useParams();
    const [balance, setBalance] = useState("")
    const [tokens, setTokens] = useState([])

    useEffect(() => {
        const getAddress = async () => {
            const balance = await alchemy.core.getBalance(id, 'latest')
            setBalance(Utils.formatEther(balance))

            const tbalance = await alchemy.core.getTokenBalances(id)
            console.log(tbalance)
            const nonZeroTokenBalance = tbalance.tokenBalances.filter(token => token.tokenBalance !== 0)
            console.log("nonZero: ", nonZeroTokenBalance)

            let tokensArray = []
            for (let i = 0; i < nonZeroTokenBalance.length; i++) {
                let tokenObj = {}
                let balance = nonZeroTokenBalance[i].tokenBalance
                const metadata = await alchemy.core.getTokenMetadata(nonZeroTokenBalance[i].contractAddress)
                //console.log(metadata);
                //console.log(balance);
                balance = balance / Math.pow(10, metadata.decimals)
                console.log(balance);

                tokenObj = { name: metadata.name, symbol: metadata.symbol, balance: balance }
                tokensArray.push(tokenObj)
            }

            setTokens(tokensArray);
        }
        getAddress()
    }, [id])

    console.log("id: ", id);
    console.log("balance: ", balance);
    console.log("tokens Array: ", tokens);


    return (
        <div className="App container mt-5">
            

                <h3>Address</h3>
                <table className="table table-striped">
                    <thead></thead>
                    <tbody>
                        <tr>
                            <td>Address:</td>
                            <td className="text-end">{id}</td>
                        </tr>
                        <tr>
                            <td>Balance:</td>
                            <td className="text-end" >{balance.slice(0, 7)} ETH</td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <h3>Tokens</h3>
                {tokens.length === 0 ? (
                    <div>
                        <h3>
                            This address does not hold any tokens.
                        </h3>
                    </div>
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
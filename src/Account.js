import { Alchemy, Network,Utils } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';


const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function Accounts(){
const [address, setAddress] = useState('')
const [balance, setBalance] = useState(null)

const getBalance = async ()=> {
    if(address){
        const balance = await alchemy.core.getBalance(address)
        console.log(balance)
        const balanceInEther = Utils.formatEther(balance)
        console.log(balanceInEther);
        
        setBalance(balanceInEther)
    }
}

return (
    <div>
        <h2>Check account balance</h2>
        <input
        type="text"
        placeholder="Enter address"
        value={address}
        onChange={(e)=>setAddress(e.target.value)}
        />
        <button onClick={getBalance}>Get Balance</button>
        {balance !=null && (
            <p>Balance is: {balance} Eth</p>
        )}
      </div>
)
}

export default Accounts;
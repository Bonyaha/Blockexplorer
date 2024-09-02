import React, { useState } from 'react';
import { Route, Routes, Link,useNavigate } from 'react-router-dom';
import './index.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './components/Home.js';
import Block from './components/Block.js';
import Address from './components/Address.js';
import BlockTransactions from './components/BlockTransactions.js';
import Transaction from './components/Transaction.js';




const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate()

    console.log('search is: ', searchTerm);

    const handleSearch = () => {
        const input = searchTerm.trim();
        if (!input) return;
    
        if (/^[0-9]+$/.test(input)) { // Check if input is a block number
          navigate(`/block/${input}`);
        } else if (/^0x[a-fA-F0-9]{64}$/.test(input)) { // Check if input is a valid tx hash
          navigate(`/transaction/${input}`);
        } else if (/^0x[a-fA-F0-9]{40}$/.test(input)) { // Check if input is a valid address
          navigate(`/address/${input}`);
        } else {
          alert('Invalid input. Please enter a valid block number, transaction hash, or address.')
          return
        }
        setSearchTerm('')
      }

    return (
        <div className="App container mt-5">
            <Link to={`/`} className="text-decoration-none"><h1 className="text-center mb-4">Ethereum Block Explorer</h1></Link>

            <div className="mb-4">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter block number, transaction hash, or address"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={handleSearch}>Search</button>
                </div>
            </div>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/block/:id" element={<Block />} />
                <Route path="/address/:id" element={<Address />} />
                <Route path="/blockTransactions/:id" element={<BlockTransactions />} />
                <Route path="/transaction/:id" element={<Transaction />} />
            </Routes>
        </div>
    )
}



export default App


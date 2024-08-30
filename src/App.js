import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import './index.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './components/Home.js';
import Block from './components/Block.js';
import Address from './components/Address.js';
import BlockTransactions from './components/BlockTransactions.js';
import Transaction from './components/Transaction.js';




const App = () => {
    return (
        <div className="App container mt-5">
            <Link to={`/`} className="text-decoration-none"><h1 className="text-center mb-4">Ethereum Block Explorer</h1></Link>

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


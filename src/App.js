import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes,Link } from 'react-router-dom';
import './index.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './Home.js';
import Block from './Block';
import Address from './Address';
import BlockTransactions from './BlockTransactions';
/* import Transaction from './Transaction';
import Block from './Block';
import Account from './Account';
import Address from './Address';
import BlockTransactions from './BlockTransactions'; */



const App = () => {
    return(
        <div className="App container mt-5">
        <Link to={`/`} className="text-decoration-none"><h1 className="text-center mb-4">Ethereum Block Explorer</h1></Link>

        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/block/:id" element={<Block />} />
        <Route path="/address/:id" element={<Address />} />
        <Route path="/blockTransactions/:id" element={<BlockTransactions />} />
        {/* <Route path="/accounts" element={<Account />} />       
        
        <Route path="/transaction/:id" element={<Transaction />} />
       
        <Route path="/blockTransactions/:id" element={<BlockTransactions />} /> */}
      </Routes>
      </div>
    )
}



export default App


import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
/* import Transaction from './Transaction';
import Block from './Block';
import Account from './Account';
import Address from './Address';
import BlockTransactions from './BlockTransactions'; */

import reportWebVitals from './reportWebVitals';

// Create a root.
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        {/* <Route path="/accounts" element={<Account />} />       
        <Route path="/block/:id" element={<Block />} />
        <Route path="/transaction/:id" element={<Transaction />} />
        <Route path="/address/:id" element={<Address />} />
        <Route path="/blockTransactions/:id" element={<BlockTransactions />} /> */}
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


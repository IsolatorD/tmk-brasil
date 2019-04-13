import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import './App.css';
import './index.css'
import 'bootstrap/dist/css/bootstrap.css';
import DataTable from 'datatables.net';
import { BrowserRouter, Route } from 'react-router-dom';

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <BrowserRouter>
        <div>
            <Route exact path='/' component={Login}/>
            <Route path='/dashboard' component={Layout} />
        </div>
    </BrowserRouter>
    , document.getElementById('root'));
registerServiceWorker();
import React, { Component, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary.js';

import Header from '../header/Header.js';
import Footer from '../footer/Footer.js';
import Register from '../auth/Register.js';
import Login from '../auth/Login.js';
import Home from '../home/Home.js';
import About from '../about/About.js';
import Classroom from '../classroom/Classroom.js';
import Device from '../device/Device.js';
import Report from '../report/Report.js';
import ReportListView from '../report/ReportListView.js';
import ReportPageView from '../report/ReportPageView.js';
import Admin from '../admin/Admin.js';
import PrivateRoute from './PrivateRoute.js';
import AdminRoute from './AdminRoute.js';
import { AuthContext, AdminContext, getAuth, isAdmin } from "../auth/auth.js";
import utils from '../../models/utils.js';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.authCheck = this.authCheck.bind(this);
        this.state = {
            auth: null,
            admin: null
        };
        this.saveState = (page, state) => {
            this.setState({
                [page]: state
            });
        };
        this.restoreState = (page) => {
            return this.state[page];
        };
    }

    componentDidMount() {
        this.authCheck();
    }

    authCheck(redirect = false) {
        let res = getAuth();

        res.then(data => {
            this.setState({
                auth: data.active,
                admin: isAdmin()
            }, () => redirect && window.location.replace(redirect));
        });
    };

    render() {
        return (
            <AuthContext.Provider value={ this.state.auth }>
                <AdminContext.Provider value={ this.state.admin }>
                    <Router>
                        <div className="App">
                            <Header auth={ this.state.auth } admin={ this.state.admin } />
                            <div className="page-wrapper">
                                <Switch>
                                    <PrivateRoute exact path="/" component={Home} save={this.saveState} restore={this.restoreState} />
                                    <Route exact path="/register" component={Register} />
                                    <Route exact path="/login" render={ () => <Login authCheck={ this.authCheck } /> } />
                                    <PrivateRoute exact path="/about" component={About} />
                                    <PrivateRoute exact path="/device" component={Device} />
                                    <PrivateRoute exact path="/classroom" component={Classroom} />
                                    <PrivateRoute exact path="/report" component={Report} />
                                    <PrivateRoute exact path="/report/list" component={ReportListView} />
                                    <PrivateRoute path="/report/page" component={ReportPageView} />
                                    <AdminRoute path="/admin/:selected?/:admin?/:id?" component={Admin} save={this.saveState} restore={this.restoreState} />
                                </Switch>
                            </div>
                            <Footer auth={ this.state.auth } admin={ this.state.admin } />
                        </div>
                    </Router>
                </AdminContext.Provider>
            </AuthContext.Provider>
        );
    }
}

export default App;

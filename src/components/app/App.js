import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Header from '../page/Header.js';
import Home from '../page/Home.js';
import Login from '../auth/Login.js';
import Register from '../auth/Register.js';
// import Wallet from '../page/Wallet.js';
// import Orders from '../page/Orders.js';
import Profile from '../page/Profile.js';
// import About from '../page/About.js';
import Footer from '../page/Footer.js';
import auth from '../../models/auth.js';

import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeUser: "",
            register: ""
        };
    }

    componentDidMount() {
        let that = this;

        auth.isactive()
            .then(function(res) {
                if (res.data.active) {
                    console.log("Successfully Authenticated");
                    that.adminRoutes();
                } else {
                    that.registerRoute();
                    console.log("Authentication failed");
                    localStorage.clear();
                }
            });
    }

    adminRoutes() {
        this.setState({
            activeUser: [
                <div key="adminRouter">
                    <Route exact path="/profile" component={Profile} />
                </div>
            ]
        });
    }

    registerRoute() {
        this.setState({
            register: [
                <div key="registerRoute">
                    <Route exact path="/register" component={Register} />
                </div>
            ]
        });
    }

    render() {
        return (
            <Router>
                <div className="App">
                    <Header />
                    <div className="page-wrapper">
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route exact path="/login" component={Login} />
ª                            { this.state.register }
                            { this.state.activeUser }
                        </Switch>
                    </div>
                    <Footer />
                </div>
            </Router>
        );
    }
}

export default App;

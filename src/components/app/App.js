import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Header from '../header/Header.js';
import Footer from '../footer/Footer.js';
import About from '../about/About.js';
import Classroom from '../classroom/Classroom.js';
import Device from '../device/Device.js';
import Admin from '../admin/Admin.js';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeUser: "",
            register: "",
            classroomState: null,
            adminState: null,
            managerState: null
        };
        this.saveState = function(page, state) {
            this.setState({
                [page]: state
            });
        }.bind(this);
        this.restoreState = function(page) {
            return this.state[page];
        }.bind(this);
    }

    // componentDidMount() {
    //     let that = this;
    //
    //     auth.isactive()
    //         .then(function(res) {
    //             if (res.data.active) {
    //                 console.log("Successfully Authenticated");
    //                 that.adminRoutes();
    //             } else {
    //                 that.registerRoute();
    //                 console.log("Authentication failed");
    //                 localStorage.clear();
    //             }
    //         });
    // }

    // adminRoutes() {
    //     this.setState({
    //         activeUser: [
    //             <div key="adminRouter">
    //                 <Route exact path="/profile" component={Profile} />
    //             </div>
    //         ]
    //     });
    // }

    // registerRoute() {
    //     this.setState({
    //         register: [
    //             <div key="registerRoute">
    //                 <Route exact path="/register" component={Register} />
    //             </div>
    //         ]
    //     });
    // }

    render() {
        return (
            <Router>
                <div className="App">
                    <Header />
                    <div className="page-wrapper">
                        <Switch>
                            <Route exact path="/" render={() => <Classroom save={this.saveState} restore={this.restoreState} />} />
                            <Route exact path="/device" component={Device} />
                            <Route exact path="/admin" render={() => <Admin save={this.saveState} restore={this.restoreState} />} />
                            <Route exact path="/about" component={About} />
                        </Switch>
                    </div>
                    <Footer />
                </div>
            </Router>
        );
    }
}

export default App;

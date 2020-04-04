import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary.js';

import Header from '../header/Header.js';
import Footer from '../footer/Footer.js';
import Home from '../home/Home.js';
import About from '../about/About.js';
import Classroom from '../classroom/Classroom.js';
import Device from '../device/Device.js';
import Report from '../report/Report.js';
import ReportList from '../report/view/ReportList.js';
import ReportPage from '../report/view/ReportPage.js';
import Admin from '../admin/Admin.js';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeUser: "",
            register: ""
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
                            <Route exact path="/" render={() => <Home save={this.saveState} restore={this.restoreState} />} />
                            <Route exact path="/about" component={About} />
                            <Route exact path="/device" component={Device} />
                            <Route exact path="/classroom" component={Classroom} />
                            <Route exact path="/report" render={() => <ErrorBoundary><Report /></ErrorBoundary>} />
                            <Route exact path="/report/list" component={ReportList} />
                            <Route exact path="/report/page" component={ReportPage} />
                            <Route exact path="/admin" render={() => <Admin save={this.saveState} restore={this.restoreState} />} />
                        </Switch>
                    </div>
                    <Footer />
                </div>
            </Router>
        );
    }
}

export default App;

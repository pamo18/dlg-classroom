import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Header from '../header/Header.js';
import Footer from '../footer/Footer.js';
import About from '../about/About.js';
import Classroom from '../classroom/Classroom.js';
import Admin from '../admin/Admin.js';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeUser: "",
            register: ""
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
                            <Route exact path="/" component={Classroom} />
                            <Route exact path="/about" component={About} />
                            <Route exact path="/admin" component={Admin} />
                        </Switch>
                    </div>
                    <Footer />
                </div>
            </Router>
        );
    }
}

export default App;

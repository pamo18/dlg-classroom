/*eslint max-len: ["error", { "code": 200 }]*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import base from '../../config/api.js';
import io from 'socket.io-client';
let api = base.api();

class Login extends Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };
    constructor(props) {
        super(props);
        this.registerSubmit = this.registerSubmit.bind(this);
        this.toggleShowPassword = this.toggleShowPassword.bind(this);
        this.logoff = this.logoff.bind(this);
        this.state = {
            showing: false,
            hidden: true,
            button: true,
            invalid: false,
            user: "",
            username: ""
        };
    }
    registerSubmit(event) {
        let that = this;

        event.preventDefault();
        const data = new FormData(event.target);

        let person = {
            "name": data.get('name'),
            "password": data.get('password')
        };

        fetch(api + "/login", {
            method: 'POST',
            body: JSON.stringify(person),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(function (res) {
                if (res.data.result) {
                    localStorage.setItem("activeUser", JSON.stringify(res.data.user));
                    localStorage.setItem("token", JSON.stringify(res.data.token));
                    that.props.history.push('/');
                    window.location.reload(false);
                } else {
                    that.setState({
                        invalid: <p className="center invalid">{res.data.user}</p>
                    });
                }
            });
    }
    toggleShowPassword() {
        this.setState({
            hidden: !this.state.hidden,
            button: !this.state.button
        });
    }
    logoff() {
        localStorage.clear();
        this.setState({
            user: ""
        });
        this.props.history.push('/login');
        window.location.reload(false);
    }
    render() {
        let user = localStorage.getItem("activeUser");

        if (user === null) {
            return (
                <main>
                    <div className="page-heading">
                        <h1>Logga in</h1>
                    </div>
                    <article>
                        <div className="column">
                            <div className="column-1">
                                <div className="form-wrapper">
                                    <p className="center">För att använda DLG Classroom måste du först logga in.</p>
                                    <form action="/profile" className="form-register" onSubmit={this.registerSubmit}>
                                        <label className="form-label">Användernamn
                                            <input className="form-input" type="text" name="name" required placeholder="Ditt användernamn" />
                                        </label>

                                        <label className="form-label">Lösenord
                                            <input
                                                className="form-input password"
                                                type={this.state.hidden ? "password" : "text"}
                                                name="password"
                                                placeholder="Your password"
                                                required
                                            />
                                            <p><input type="checkbox" className="show-password" onClick={this.toggleShowPassword} /> {this.state.button ? "Visa" : "Dölja"} Lösenord</p>
                                        </label>
                                        <input className="button center" type="submit" name="login" value="Login" />
                                    </form>
                                    {this.state.invalid}
                                </div>
                            </div>
                        </div>
                    </article>
                </main>
            );
        } else {
            return (
                <main>
                    <div className="page-heading">
                        <h1>Goodbye?</h1>
                    </div>
                    <article>
                        <div className="column">
                            <div className="column-1">
                                <div className="form-wrapper">
                                    <p>
                                        <button name="logoff" className="button center" onClick={this.logoff}>Logoff</button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </article>
                </main>
            );
        }
    }
}

export default Login;

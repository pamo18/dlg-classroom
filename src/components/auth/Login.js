/* eslint max-len: ["error", { "code": 200 }] */

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../models/db.js';
import utils from '../../models/utils.js';
import { AuthContext } from "../auth/auth.js";

class Login extends Component {
    static contextType = AuthContext;
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

    componentWillUnmount() {
        window.scrollTo(0, 0);
    }

    registerSubmit(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        const { setAuth } = this.context;

        let person = {
            "email": data.get("email"),
            "password": data.get("password")
        };

        let res = db.login(person);

        res.then((data) => {
            let invalid = false,
                person,
                token;

            switch(true) {
                case (!data.email):
                    invalid = "Ogiltid epost!";
                    break;
                case (data.email && !data.password):
                    invalid = "Ogiltid lösenord";
                    break;
                case (data.email && data.password):
                    person = data.person;
                    token = data.token;
                    localStorage.setItem("person", JSON.stringify(person));
                    localStorage.setItem("token", JSON.stringify(token));
                    setAuth(true, person.level === "admin");
                    if (this.props.location.state) {
                        let lastPage = this.props.location.state.from.pathname;
                        return utils.redirect(this, lastPage);
                    } else {
                        return utils.redirect(this, "/");
                    }

                default:
                    return utils.redirect(this, "/login");
            }

            this.setState({
                invalid: <p className="center invalid">{ invalid }</p>
            });
        });
    }

    toggleShowPassword() {
        this.setState({
            hidden: !this.state.hidden,
            button: !this.state.button
        });
    }

    logoff() {
        const { setAuth } = this.context;

        localStorage.clear();
        setAuth(null, null);
        return utils.redirect(this, "/login");
    }

    render() {
        if (!this.context.isAuth) {
            return (
                <main>
                    <div className="single-column">
                        <div className="column-heading">
                            <h1>Logga in</h1>
                        </div>
                        <article>
                            <form action="/profile" className="form-register" onSubmit={this.registerSubmit}>
                                <label className="form-label">Epost
                                    <input className="form-input" type="email" name="email" required placeholder="Din epost" />
                                </label>

                                <label className="form-label">Lösenord
                                    <input
                                        className="form-input password"
                                        type={this.state.hidden ? "password" : "text"}
                                        name="password"
                                        placeholder="Ditt lösenord"
                                        required
                                    />
                                    <p><input type="checkbox" className="show-password" onClick={this.toggleShowPassword} /> {this.state.button ? "Visa" : "Dölja"} Lösenord</p>
                                </label>
                                <div>
                                    <input className="button center-margin" type="submit" name="login" value="Logga in" />
                                    <p><button name="forgot" className="button forgot center-margin" onClick={ () => utils.redirect(this, "/forgot") }>Glömt Lösenord?</button></p>
                                </div>
                                { this.state.invalid }
                            </form>
                        </article>
                    </div>
                </main>
            );
        } else {
            return (
                <main>
                    <div className="single-column">
                        <div className="column-heading">
                            <h1>Logga ut?</h1>
                        </div>
                        <article>
                            <p>
                                <button name="logoff" className="button center-margin" onClick={this.logoff}>Logga ut</button>
                            </p>
                        </article>
                    </div>
                </main>
            );
        }
    }
}

export default withRouter(Login);

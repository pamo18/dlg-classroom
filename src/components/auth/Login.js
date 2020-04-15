/*eslint max-len: ["error", { "code": 200 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../models/db.js';
import utils from '../../models/utils.js';

class Login extends Component {
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

    registerSubmit(e) {
        e.preventDefault();
        const data = new FormData(e.target);

        let person = {
            "email": data.get("email"),
            "password": data.get("password")
        };

        let res = db.login(person);

        res.then((data) => {
            console.log(data);
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
                    localStorage.setItem("user", JSON.stringify(person));
                    localStorage.setItem("token", JSON.stringify(token));
                    utils.reload(this, "/");
                    break;
            }

            if (invalid) {
                this.setState({
                    invalid: <p className="center invalid">{ invalid }</p>
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

        utils.reload(this, "/login", true);
    }

    render() {
        let user = localStorage.getItem("user");

        if (user === null) {
            return (
                <main>
                    <div className="single-column">
                        <div className="column-heading">
                            <h1>Logga in</h1>
                        </div>
                        <article>
                            <form action="/profile" className="form-register" onSubmit={this.registerSubmit}>
                                <p className="center">För att använda DLG Classroom måste du först logga in.</p>
                                <label className="form-label">Epost
                                    <input className="form-input" type="email" name="email" required placeholder="Din epost" />
                                </label>

                                <label className="form-label">Lösenord
                                    <input
                                        className="form-input password"
                                        type={this.state.hidden ? "password" : "text"}
                                        name="password"
                                        placeholder="Din lösenord"
                                        required
                                    />
                                    <p><input type="checkbox" className="show-password" onClick={this.toggleShowPassword} /> {this.state.button ? "Visa" : "Dölja"} Lösenord</p>
                                </label>
                                <input className="button center-margin" type="submit" name="login" value="Logga in" />
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

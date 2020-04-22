/*eslint max-len: ["error", { "code": 200 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../models/db.js';
import utils from '../../models/utils.js';

class Reset extends Component {
    constructor(props) {
        super(props);
        this.registerSubmit = this.registerSubmit.bind(this);
        this.toggleShowPassword = this.toggleShowPassword.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.state = {
            invalid: false,
            token: this.props.match.params.token || null,
            showing: false,
            password: "",
            strength: 0,
            button: true,
            hidden: true
        };
    }

    componentDidMount() {
        if (!this.state.token) {
            return utils.redirect(this, "/forgot");
        }
    }

    componentWillUnmount() {
        window.scrollTo(0, 0);
    }

    registerSubmit(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        let token = this.state.token;

        let person = {
            "email": data.get("email"),
            "password": data.get("password")
        };

        let reset = db.resetPassword(person, token);

        reset.then((res) => {
            let invalid = false;

            if (res.hasOwnProperty("err")) {
                invalid = res.err;

                return this.setState({
                    invalid: <p className="center invalid"><error>{ invalid }</error></p>
                });
            }

            return utils.redirect(this, "/login");
        });
    }

    toggleShowPassword() {
        this.setState({
            hidden: !this.state.hidden,
            button: !this.state.button
        });
    }

    onPasswordChange(e) {
        let val = e.target.value;

        this.setState({
            strength: utils.passwordChecker(val),
            password: val
        });
    }

    render() {
        // eslint-disable-next-line
        const { showing } = this.state;

        return (
            <main>
                <div className="single-column">
                    <div className="column-heading">
                        <h1>Återställa Lösenord</h1>
                    </div>
                    <article>
                        <form action="/profile" className="form-register" onSubmit={ this.registerSubmit }>
                            <label className="form-label">Epost
                                <input className="form-input" type="email" name="email" required placeholder="Din epost" />
                            </label>

                            <label className="form-label">Ny Lösenord: Minst 1 stor bokstäv, 1 siffra, 4+ bokstäver lång.
                                <input
                                    className="form-input password"
                                    type={ this.state.hidden ? "password" : "text" }
                                    name="password"
                                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}"
                                    value={this.state.password}
                                    placeholder="Din nya lösenord"
                                    required
                                    onChange={ this.onPasswordChange }
                                />
                                <p><input type="checkbox" className="show-password" onClick={ this.toggleShowPassword } /> { this.state.button ? "Visa" : "Dölja" } Lösenord</p>
                            </label>

                            <label className="form-label">Lösenord styrke
                                <meter className="form-meter" min="0" low="4" optimum="9" high="8" max="10" value={ this.state.strength }></meter>
                            </label><br />
                            <input className="button center-margin" type="submit" name="forgot" value="Återställ" />
                            { this.state.invalid }
                        </form>
                    </article>
                </div>
            </main>
        );
    }
}

export default withRouter(Reset);

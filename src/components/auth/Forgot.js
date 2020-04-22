/*eslint max-len: ["error", { "code": 200 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../models/db.js';
import utils from '../../models/utils.js';

class Forgot extends Component {
    constructor(props) {
        super(props);
        this.registerSubmit = this.registerSubmit.bind(this);
        this.state = {
            invalid: false
        };
    }

    componentWillUnmount() {
        window.scrollTo(0, 0);
    }

    registerSubmit(e) {
        e.preventDefault();
        const data = new FormData(e.target);

        let person = {
            "email": data.get("email")
        };

        let res = db.forgotPassword(person);

        res.then((data) => {
            if (data.hasOwnProperty("err")) {
                let invalid = data.err;

                return this.setState({
                    invalid: <p className="center invalid"><error>{ invalid }</error></p>
                });
            } else {
                return utils.redirect(this, "/login");
            }
        });
    }

    render() {
        return (
            <main>
                <div className="single-column">
                    <div className="column-heading">
                        <h1>Glömt Lösenord</h1>
                    </div>
                    <article>
                        <p class="center">Du kommer att få en länk till din epost address för att återställa din lösnord.</p>
                        <form action="/profile" className="form-register" onSubmit={ this.registerSubmit }>
                            <label className="form-label">Epost
                                <input className="form-input" type="email" name="email" required placeholder="Din epost" />
                            </label>

                            <input className="button center-margin" type="submit" name="forgot" value="Återställ" />
                            { this.state.invalid }
                        </form>
                    </article>
                </div>
            </main>
        );
    }
}

export default withRouter(Forgot);

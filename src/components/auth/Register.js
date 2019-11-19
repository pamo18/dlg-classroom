/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import DatePicker from './DatePicker.js';
import utils from '../../models/utils.js';
import base from '../../config/api.js';
let api = base.api();

class Register extends Component {
    constructor(props) {
        super(props);
        this.registerSubmit = this.registerSubmit.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.toggleShowPassword = this.toggleShowPassword.bind(this);
        this.getCountries = this.getCountries.bind(this);
        this.commonCountries = this.commonCountries.bind(this);
        this.addToCommon = this.addToCommon.bind(this);
        this.state = {
            countries: "",
            commonOptions: "",
            commonCountries: "",
            selectedCountry: "Sweden",
            showing: false,
            password: "",
            hidden: true,
            button: true,
            strength: 0
        };
    }
    componentDidMount() {
        this.getCountries();
        this.commonCountries();
    }
    registerSubmit(event) {
        const that = this;

        event.preventDefault();
        const data = new FormData(event.target);

        let person = {
            "name": data.get('name'),
            "birthday": data.get('date'),
            "country": data.get('country'),
            "email": data.get('email'),
            "password": data.get('password')
        };


        fetch(api + "/register", {
            method: 'POST',
            body: JSON.stringify(person),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function() {
            let common = {
                "countries": that.state.commonCountries.join(",")
            };

            fetch(api + "/common/countries", {
                method: 'POST',
                body: JSON.stringify(common),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(that.props.history.push('/login'));
        });
    }
    addToCommon(e) {
        let commonCountries = this.state.commonCountries,
            country = e.target.value;

        if (!commonCountries.includes(country)) {
            commonCountries.unshift(country);
            if (commonCountries.length > 3) {
                commonCountries.pop();
            }
        }
        this.setState({
            commonCountries: commonCountries,
            selectedCountry: country
        });
    }
    commonCountries() {
        let commonOptions = [],
            commonCountries = [];

        const that = this;

        fetch(api + `/common/countries`)
            .then(res => res.json())
            .then(function(res) {
                let result = res.data.common.item;

                result = result.split(",");
                result.forEach(function (row) {
                    commonOptions.push(<option key={row} value={row}>{row}</option>);
                    commonCountries.push(row);
                });
                that.setState({
                    commonOptions: commonOptions,
                    commonCountries: commonCountries,
                    selectedCountry: result[0]
                });
            });
    }
    getCountries() {
        let countries = [];

        const that = this;

        fetch(api + `/countries`)
            .then(res => res.json())
            .then(function(res) {
                let result = res.data.countries;

                result.forEach(function (row) {
                    countries.push(<option key={row.country} value={row.country}>{row.country}</option>);
                });
                that.setState({
                    countries: countries
                });
            });
    }
    onPasswordChange(e) {
        this.setState({
            strength: utils.passwordChecker(e.target.value),
            password: e.target.value
        });
    }
    toggleShowPassword() {
        this.setState({
            hidden: !this.state.hidden,
            button: !this.state.button
        });
    }
    render() {
        const { showing } = this.state;

        return (
            <main>
                <div className="page-heading">
                    <h1>Registrera</h1>
                </div>
                <article>
                    <div className="column">
                        <div className="column-1">
                            <div className="form-wrapper">
                                <p className="center">För att använda DLG Classroom måste du först registrera dig.</p>
                                <form action="/login" className="form-register" onSubmit={this.registerSubmit}>
                                    <label className="form-label">Användernamn
                                        <input className="form-input" type="text" name="name" required placeholder="Ditt användernamn" />
                                    </label>

                                    <label className="form-label">Födelsedag
                                        <input onClick={() => this.setState({ showing: !showing })} id="birthday" className="form-input" type="text" readOnly="readonly" name="date" required placeholder="Klick för att välja!" />
                                    </label>
                                    { showing
                                        ? <DatePicker />
                                        : null
                                    }

                                    <label className="form-label">Land
                                        <select onChange={this.addToCommon} className="form-input" type="text" name="country" required value={this.state.selectedCountry} placeholder="Your current location">
                                            <optgroup label="Common countries">
                                                { this.state.commonOptions }
                                            </optgroup>
                                            <optgroup label="Other countries">
                                                { this.state.countries }
                                            </optgroup>
                                        </select>
                                    </label>

                                    <label className="form-label">Epost
                                        <input className="form-input" type="email" name="email" required placeholder="abc@mail.se" />
                                    </label>

                                    <label className="form-label">Lösenord: Minst 1 stor bokstäv, 1 siffra, 4+ bokstäber lång.
                                        <input
                                            className="form-input password"
                                            type={this.state.hidden ? "password" : "text"}
                                            name="password"
                                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}"
                                            value={this.state.password}
                                            placeholder="Ditt lösenord"
                                            onChange={this.onPasswordChange}
                                            required
                                        />
                                        <p><input type="checkbox" className="show-password" onClick={this.toggleShowPassword} /> {this.state.button ? "Visa" : "Dölja"} lösenord</p>
                                    </label>

                                    <label className="form-label">Lösenord styrke
                                        <meter className="form-meter" min="0" low="4" optimum="9" high="8" max="10" value={this.state.strength}></meter>
                                    </label>

                                    <label className="form-label check-label">
                                        <input className="check-input" type="checkbox" name="gdpr" required />
                                        Jag samtycker sidans <a href="https://en.wikipedia.org/wiki/Terms_of_service">policy</a>
                                    </label><br />


                                    <input className="button center" type="submit" name="register" value="Registrera" />
                                </form>
                            </div>
                        </div>
                    </div>
                </article>
            </main>
        );
    }
}

export default Register;

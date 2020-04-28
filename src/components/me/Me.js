/*eslint max-len: ["error", { "code": 500 }]*/

import React, { Component } from 'react';
import ReportFilterList from '../report/components/ReportFilterList.js';
import db from '../../models/db.js';
import utils from '../../models/utils.js';
import table from '../../models/table.js';
import './Me.css';

class Me extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Min Sida",
            person: {},
            classroomReports: [],
            filter1 : {
                person_id: JSON.parse(localStorage.getItem("person")).id,
                solved: "Att göra"
            },
            filter2 : {
                person_id: JSON.parse(localStorage.getItem("person")).id,
                solved: "OK"
            },
            actions: ["view"],
            selection : [
                ["item-category", "15%"],
                ["title", "40%"],
                ["created", "15%"],
                ["solved", "15%"],
                ["manage", "15%"]
            ]
        };
    }

    componentDidMount() {
        this.loadPerson();
    }

    componentWillUnmount() {
        window.scrollTo(0, 0);
    }

    loadPerson() {
        const person = JSON.parse(localStorage.getItem("person"));
        let id = person.id;
        let res = db.fetchWhere("person", "id", id);

        res.then((data) => {
            this.setState({
                person: data
            });
        });
    }

    render() {
        return (
            <main>
                <div className="single-column">
                    <div className="column-heading">
                        <h1>{ this.state.title }</h1>
                    </div>
                    <article>
                        <div>
                            { this.state.person && Object.entries(this.state.person).length > 0
                                ?
                                <div>
                                    <h2 className="center margin">
                                        { `${this.state.person.firstname } ${this.state.person.lastname }` }
                                    </h2>
                                    <table className="results-alt">
                                        <tbody>
                                            <tr>
                                                <th>Förnamn</th>
                                                <td>{ this.state.person.firstname }</td>
                                            </tr>
                                            <tr>
                                                <th>Efternamn</th>
                                                <td>{ this.state.person.lastname }</td>
                                            </tr>
                                            <tr>
                                                <th>Epost</th>
                                                <td>{ this.state.person.email }</td>
                                            </tr>
                                            <tr>
                                                <th>Avdelning</th>
                                                <td>{ this.state.person.department }</td>
                                            </tr>
                                            <tr>
                                                <th>Behörighet</th>
                                                <td>{ this.state.person.level.charAt(0).toUpperCase() + this.state.person.level.slice(1) }</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <p>
                                        <button name="update" className="button center-margin" onClick={ () => utils.redirect(this, "me/update") }>Ändra Uppgifter</button>
                                    </p>
                                </div>
                                :
                                null
                                }
                        </div><br />

                        <ReportFilterList
                            title="Aktiva ärenden"
                            filter={ this.state.filter1 }
                            selection={ this.state.selection }
                            actions={ this.state.actions }
                        />

                        <ReportFilterList
                            title="Klar"
                            filter={ this.state.filter2 }
                            selection={ this.state.selection }
                            actions={ this.state.actions }
                        />
                    </article>
                </div>
            </main>
        );
    }
}

export default Me;

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../../models/db.js';
import icon from '../../../models/icon.js';
import '../Report.css';

class ReportForm extends Component {
    constructor(props) {
        super(props);
        this.reportItem = this.reportItem.bind(this);
        this.formHandler = this.formHandler.bind(this);
        this.state = {
            itemGroup: this.props.itemGroup,
            itemid: this.props.itemid,
            callback: this.props.callback,
            name: "",
            message: ""
        };
    }

    reportItem(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        let itemGroup = this.state.itemGroup;
        const person = JSON.parse(localStorage.getItem("person"));
        let res;

        switch(true) {
            case (itemGroup === "classroom"):
                let classroom = {
                    name:  data.get("name"),
                    item_group: "classroom",
                    item_id: this.state.itemid,
                    message: data.get("message"),
                    person_id: person.id
                };

                res = db.insert("report", classroom);
                res.then(() => this.state.callback("classroom", this.state.itemid));
                break;
            case (itemGroup === "device"):
                let device = {
                    name:  data.get("name"),
                    item_group: "device",
                    item_id: this.state.itemid,
                    message: data.get("message"),
                    person_id: person.id
                };

                res = db.insert("report", device);
                res.then(() => this.state.callback("device", this.state.itemid));
                break;
            default:
                return;
        }

        this.setState({
            name: "",
            message: ""
        });
    }

    formHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        return (
            <form className="form-register" onSubmit={ this.reportItem }>
                <h2 className="center">
                    { icon.get("Message") }<br />
                    Formulär
                </h2>

                <label className="form-label">Titel
                    <input className="form-input" type="text" name="name" value={ this.state.name } onChange={ this.formHandler } required placeholder="En kort titel" />
                </label>

                <label className="form-label">Meddelande
                    <textarea className="form-input" name="message" value={ this.state.message } onChange={ this.formHandler } required placeholder="Förklara problemet." />
                </label>

                <input className="button center-margin" type="submit" name="create" value="Felanmäla" />
            </form>
        );
    }
}

export default withRouter(ReportForm);

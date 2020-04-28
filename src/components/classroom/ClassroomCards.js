/*eslint max-len: ["error", { "code": 300 }]*/
/* eslint eqeqeq: "off" */

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import utils from '../../models/utils.js';
import table from '../../models/table.js';
import icon from '../../models/icon.js';

class ClassroomCards extends Component {
    constructor(props) {
        super(props);
        this.getActions = this.getActions.bind(this);
        this.toggleHover = this.toggleHover.bind(this);
        this.state = {
            classrooms: this.props.classrooms,
            choice: this.props.choice,
            selection : this.props.selection,
            callbacks: this.props.callbacks || {},
            tooltip: null
        };
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
    }

    getActions(classroom) {
        let choice = this.state.choice;

        let actions = {
            "view": {
                icon: "View",
                callback: () => utils.redirect(this, "/classroom", {id: classroom.id})
            },
            "edit": {
                icon: "Edit",
                callback: () => utils.redirect(this, `/admin/classroom/edit/${ classroom.id }`, {})
            },
            "delete": {
                icon: "Delete",
                callback: () => utils.redirect(this, `/admin/classroom/delete/${ classroom.id }`, {})
            },
            "report": {
                icon: "Build",
                callback: () => utils.redirect(this, "/report", { itemGroup: "classroom", itemid: classroom.id })
            },
            "status": {
                working: classroom.working,
                callback: () => utils.redirect(this, "/report/list", { itemGroup: "classroom", itemid: classroom.id })
            }
        };

        let chosen = choice.map(action => {
            return actions[action];
        });

        return chosen;
    }

    updateData(classrooms) {
        this.setState({ classrooms })
    }

    toggleHover(tooltip) {
        this.setState({
            tooltip: tooltip
        })
    }

    render() {
        return this.state.classrooms.length > 0 && (
            <table className="results-card">
                <tbody>
                    {
                        this.state.classrooms.map((classroom) => {
                            let chosenActions = this.getActions(classroom);
                            let actions = chosenActions.map((action) => {
                                if (action.hasOwnProperty("working")) {
                                    return icon.reportStatus(action.callback, action.working, this.toggleHover);
                                }
                                    return icon.get(action.icon, action.callback, false, this.toggleHover, "Classroom");
                            });

                            return table.classroomBody(classroom, this.state.selection, actions, this.state.tooltip);
                        })
                    }
                </tbody>
            </table>
        );
    }
}

export default withRouter(ClassroomCards);

/*eslint max-len: ["error", { "code": 300 }]*/
/* eslint eqeqeq: "off" */

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import utils from '../../models/utils.js';
import table from '../../models/table.js';
import icon from '../../models/icon.js';

class DeviceCards extends Component {
    constructor(props) {
        super(props);
        this.getActions = this.getActions.bind(this);
        this.toggleHover = this.toggleHover.bind(this);
        this.state = {
            devices: this.props.devices,
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

    getActions(device) {
        let choice = this.state.choice;

        let actions = {
            "view": {
                icon: "View",
                callback: () => utils.redirect(this, "/device", {id: device.id})
            },
            "edit": {
                icon: "Edit",
                callback: () => utils.redirect(this, `/admin/device/edit/${ device.id }`, {})
            },
            "delete": {
                icon: "Delete",
                callback: () => utils.redirect(this, `/admin/device/delete/${ device.id }`, {})
            },
            "unlink": {
                icon: "Delete",
                callback: () => this.state.callbacks["unlink"](device.id)
            },
            "up": {
                icon: "Up",
                callback: () => this.state.callbacks["swap"](device.id, "up")
            },
            "down": {
                icon: "Down",
                callback: () => this.state.callbacks["swap"](device.id, "down")
            },
            "report": {
                icon: "Build",
                callback: () => utils.redirect(this, "/report", { itemGroup: "device", itemid: device.id })
            },
            "status": {
                working: device.working,
                callback: () => utils.redirect(this, "/report/list", { itemGroup: "device", itemid: device.id })
            }
        };

        let chosen = choice.map(action => {
            return actions[action];
        });

        return chosen;
    }

    updateData(devices) {
        this.setState({ devices })
    }

    toggleHover(tooltip) {
        this.setState({
            tooltip: tooltip
        })
    }

    render() {
        return this.state.devices.length > 0 && (
            <table className="results-card">
                <tbody>
                    {
                        this.state.devices.map((device) => {
                            let chosenActions = this.getActions(device);
                            let actions = chosenActions.map((action) => {
                                if (action.hasOwnProperty("working")) {
                                    return icon.reportStatus(action.callback, action.working, this.toggleHover);
                                }
                                    return icon.get(action.icon, action.callback, false, this.toggleHover, "Device");
                            });

                            return table.deviceBody(device, this.state.selection, actions, this.state.tooltip);
                        })
                    }
                </tbody>
            </table>
        );
    }
}

export default withRouter(DeviceCards);

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../../models/db.js';
import utils from '../../../models/utils.js';
import icon from '../../../models/icon.js';
import table from '../../../models/table.js';
import '../Report.css';

class ItemView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemGroup: this.props.itemGroup,
            itemData: this.props.itemData,
            itemTable: {
                head: [],
                body: []
            },
            classroomSelection: [
                ["name-caption-large", null],
                ["manage", null]
            ],
            deviceSelection: [
                ["category-caption-simple", null],
                ["manage", null]
            ]
        };
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }

        this.getItem();
    }

    getItem() {
        let itemGroup = this.state.itemGroup;
        let itemData = this.state.itemData;
        let selection,
            view,
            reportList,
            reportStatus,
            actions;

        switch(true) {
            case (itemGroup === "classroom"):
                selection = this.state.classroomSelection;
                view = () => utils.redirect(this, "/classroom", { id: itemData.id });
                reportList = () => utils.redirect(this, "/report/list", { itemGroup: "classroom", itemid: itemData.id });
                reportStatus = db.reportCheck("classroom", itemData.id);

                reportStatus.then((status) => {
                    actions = [
                        icon.reportStatus(reportList, status),
                        icon.get("View", view)
                    ];

                    this.setState({
                        itemTable: {
                            body: table.classroomBody(itemData, selection, actions)
                        }
                    });
                });
                break;
            case (itemGroup === "device"):
                selection = this.state.deviceSelection;
                view = () => utils.redirect(this, "/device", { id: itemData.id });
                reportList = () => utils.redirect(this, "/report/list", { itemGroup: "device", itemid: itemData.id });
                reportStatus = db.reportCheck("device", itemData.id);

                reportStatus.then((status) => {
                    actions = [
                        icon.reportStatus(reportList, status),
                        icon.get("View", view)
                    ];

                    this.setState({
                        itemTable: {
                            body: table.deviceBody(itemData, selection, actions)
                        }
                    });
                });
                break;
            default:
                return;
        }
    }

    render() {
        return (
            <table className="results-card single-card">
                <tbody>
                    { this.state.itemTable.body }
                </tbody>
            </table>
        );
    }
}

export default withRouter(ItemView);

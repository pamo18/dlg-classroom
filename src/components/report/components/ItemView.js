import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import '../Report.css';
import ClassroomCards from '../../classroom/ClassroomCards.js';
import DeviceCards from '../../device/DeviceCards.js';

class ItemView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemGroup: this.props.itemGroup,
            itemData: this.props.itemData,
            classroomSelection: [
                ["name-caption-large", null],
                ["manage", null]
            ],
            deviceSelection: [
                ["category-caption-advanced", null],
                ["manage", null]
            ]
        };
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
    }

    render() {
        if (this.state.itemGroup === "device") {
            return (
                <DeviceCards
                    onRef={ref => (this.devices = ref)}
                    devices={ [this.state.itemData] }
                    choice={ ["status", "view"] }
                    selection={ this.state.deviceSelection }
                />
            );
        } else if (this.state.itemGroup === "classroom") {
            return (
                <ClassroomCards
                    onRef={ref => (this.classrooms = ref)}
                    classrooms={ [this.state.itemData] }
                    choice={ ["status", "view"] }
                    selection={ this.state.classroomSelection }
                />
            );
        }
    }
}

export default withRouter(ItemView);

/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import ItemData from './components/ItemData.js';
import ItemView from './components/ItemView.js';
import ReportForm from './components/ReportForm.js';
import ReportItemList from './components/ReportItemList.js';
import './Report.css';

class Report extends Component {
    constructor(props) {
        super(props);
        this.listHandler = this.listHandler.bind(this);
        this.state = {
            title: "Felanmäla",
            itemGroup: this.props.location.state.itemGroup || "",
            itemid: this.props.location.state.itemid || "",
            itemData: null
        };
    }

    componentDidMount() {
        let data = ItemData(this.state.itemGroup, this.state.itemid);

        data.then(itemData => this.setState({ itemData }))
    }

    componentWillUnmount() {
        window.scrollTo(0, 0);
    }

    listHandler(itemGroup, itemid) {
        let data = ItemData(this.state.itemGroup, this.state.itemid);

        data.then((itemData) => {
            this.list.loadReports(itemGroup, itemid);
            if (itemGroup === "classroom") {
                this.item.classrooms.updateData([itemData]);
            } else if (itemGroup === "device") {
                this.item.devices.updateData([itemData]);
            }
        });
    }

    render() {
        return this.state.itemData && (
            <div className="single-column">
                <div className="column-heading">
                    <h1>{ this.state.title }</h1>
                </div>
                <article>
                    <ItemView
                        onRef={ref => (this.item = ref)}
                        itemGroup={ this.state.itemGroup }
                        itemData={ this.state.itemData }
                    />

                    <ReportForm
                        itemGroup={ this.state.itemGroup }
                        itemid={ this.state.itemid }
                        callback={ this.listHandler }
                    />

                    <ReportItemList
                        onRef={ref => (this.list = ref)}
                        itemGroup={ this.state.itemGroup }
                        itemid={ this.state.itemData.id }
                    />
                </article>
            </div>
        );
    }
}

export default withRouter(Report);

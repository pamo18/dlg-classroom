/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import ReportItem from './components/ReportItem.js';
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
            itemData: this.props.location.state.itemData || {}
        };
    }

    componentWillUnmount() {
        window.scrollTo(0, 0);
    }

    listHandler(itemGroup, itemData) {
        this.list.loadReports(itemGroup, itemData);
    }

    render() {
        return (
            <div className="single-column">
                <div className="column-heading">
                    <h1>{ this.state.title }</h1>
                </div>
                <article>
                    <ReportItem
                        itemGroup={ this.state.itemGroup }
                        itemData={ this.state.itemData }
                    />

                    <ReportForm
                        itemGroup={ this.state.itemGroup }
                        itemData={ this.state.itemData }
                        callback={ this.listHandler }
                    />

                    <ReportItemList
                        onRef={ref => (this.list = ref)}
                        itemGroup={ this.state.itemGroup }
                        itemData={ this.state.itemData }
                    />
                </article>
            </div>
        );
    }
}

export default withRouter(Report);

/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import ReportItem from './components/ReportItem.js';
import ReportList from './components/ReportList.js';
import './Report.css';

class ReportListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Felanmäla",
            itemGroup: this.props.location.state.itemGroup || "",
            itemData: this.props.location.state.itemData || {}
        };
    }

    componentWillUnmount() {
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <div className="main-column">
                <div className="column-heading">
                    <h1>{ this.state.title }</h1>
                </div>
                <article>
                    <ReportItem
                        itemGroup={ this.state.itemGroup }
                        itemData={ this.state.itemData }
                    />

                    <ReportList
                        onRef={ref => (this.list = ref)}
                        itemGroup={ this.state.itemGroup }
                        itemData={ this.state.itemData }
                    />

                </article>
                { this.state.reportList }
            </div>
        );
    }
}

export default withRouter(ReportListView);

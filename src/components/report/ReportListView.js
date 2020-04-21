/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import ReportItem from './components/ReportItem.js';
import ReportItemList from './components/ReportItemList.js';
import './Report.css';

class ReportListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Felanmälningar",
            itemGroup: this.props.location.state.itemGroup || "",
            itemData: this.props.location.state.itemData || {}
        };
    }

    componentWillUnmount() {
        window.scrollTo(0, 0);
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

                    <ReportItemList
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

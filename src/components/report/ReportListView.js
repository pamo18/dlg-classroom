/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import ItemData from './components/ItemData.js';
import ItemView from './components/ItemView.js';
import ReportItemList from './components/ReportItemList.js';
import './Report.css';

class ReportListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Felanmälningar",
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

    render() {
        return this.state.itemData && (
            <div className="single-column">
                <div className="column-heading">
                    <h1>{ this.state.title }</h1>
                </div>
                <article>
                    <ItemView
                        itemGroup={ this.state.itemGroup }
                        itemData={ this.state.itemData }
                    />

                    <ReportItemList
                        itemGroup={ this.state.itemGroup }
                        itemid={ this.state.itemData.id }
                    />
                </article>
                { this.state.reportList }
            </div>
        );
    }
}

export default withRouter(ReportListView);

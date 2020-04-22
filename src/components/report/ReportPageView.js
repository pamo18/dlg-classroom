/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import ItemData from './components/ItemData.js';
import ItemView from './components/ItemView.js';
import ReportView from './components/ReportView.js';
import ReportItemList from './components/ReportItemList.js';
import './Report.css';

class ReportPageView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Felanmälningar",
            id: this.props.location.state.id,
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

                    <ReportView
                        id={ this.state.id }
                    />

                    <ReportItemList
                        itemGroup={ this.state.itemGroup }
                        itemid={ this.state.itemData.id }
                    />
                </article>
            </div>
        );
    }
}

export default withRouter(ReportPageView);

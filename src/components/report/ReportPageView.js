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
            id: this.props.match.params.id || "",
            itemGroup: this.props.match.params.itemGroup || "",
            itemid: this.props.match.params.itemid || "",
            itemData: null
        };
    }

    componentDidMount() {
        let id = this.state.id || (
            this.props.location.state && this.props.location.state.id
        );
        let itemGroup = this.state.itemGroup || (
            this.props.location.state && this.props.location.state.itemGroup
        );
        let itemid = this.state.itemid || (
            this.props.location.state && this.props.location.state.itemid
        );

        let data = ItemData(itemGroup, itemid);

        data && data.then(itemData => this.setState({ id, itemGroup, itemid, itemData }));
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

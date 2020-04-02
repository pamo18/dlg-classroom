/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../models/db.js';
import icon from '../../models/icon.js';
import './Categories.css';

class Categories extends Component {
    constructor(props) {
        super(props);
        this.categories = this.categories.bind(this);
        this.filter = this.filter.bind(this);
        this.state = {
            title: this.props.title,
            data: [],
            filterCb: this.props.filterCb,
            url: this.props.url,
            categoryName: this.props.categoryName,
            filter: "Alla"
        };
    }

    componentDidMount() {
        let stateName = this.props.stateName;
        let state = this.props.restore(`${stateName}`);

        if (state) {
            this.setState({
                data: state.data,
                filter: state.filter
            });
        } else {
            this.categories();
        }
    }

    componentWillUnmount() {
        let stateName = this.props.stateName;

        this.props.save(`${stateName}`, this.state);
    }

    categories() {
        let res = db.fetchAll(this.state.url);

        res.then((data) => {
            console.log(data);
            this.setState({
                data: data
            });
        });
    }

    filter(category) {
        this.state.filterCb(category);

        this.setState({
            filter: category
        });
    }

    render() {
        let filter = this.state.filter;
        return (
            <figure className="admin-group">
                <h2 className="center">{ this.state.title }</h2>
                <figcaption>
                    <div className="control-icon filter-categories">
                        { icon.getFigure("Alla", () => { this.filter("Alla") }, filter === "Alla") }

                        {
                            this.state.data.map((cat) => {
                                let category = cat[this.state.categoryName];
                                let key = `filter-category-${category}`;

                                return icon.getFigure(category, () => { this.filter(category) }, filter === category)
                            })
                        }
                    </div>
                </figcaption>
            </figure>
        );
    }
}

export default withRouter(Categories);

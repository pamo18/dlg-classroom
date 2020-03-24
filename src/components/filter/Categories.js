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
            title: "Filter",
            data: [],
            filterCb: "",
            url: "",
            name: "",
            selected: "all"
        };
    }

    componentDidMount() {
        this.setState({
            filterCb: this.props.filterCb,
            url: this.props.url,
            name: this.props.name
        }, () => this.categories());
    }

    categories() {
        let res = db.fetchAll(this.state.url);

        res.then((data) => {
            this.setState({
                data: data
            });
        });
    }

    filter(category) {
        this.state.filterCb(category);

        this.setState({
            selected: category
        });
    }

    render() {
        return (
            <div className="page-wrapper">
                <h2 className="center">{ this.state.title }</h2>
                <div className="admin-control category-view">
                    <figure
                        className={ this.state.selected === "all" ? "selected" : "clickable" }
                        onClick={() => this.filter("all") }
                    >
                        { icon.get("All") }
                        <figcaption>
                            Alla
                        </figcaption>
                    </figure>
                    {
                        this.state.data.map((cat) => {
                            let category = cat[this.state.name];
                            let key = `filter-category-${category}`;
                            let selected = this.state.selected;

                            return [
                                <figure
                                    key={ key }
                                    className={ category === selected ? "selected" : "clickable" }
                                    onClick={() => this.filter(category) }
                                >
                                    { icon.get(category) }
                                    <figcaption>
                                        { category }
                                    </figcaption>
                                </figure>
                            ]
                        })
                    }
                </div>
            </div>
        );
    }
}

export default withRouter(Categories);

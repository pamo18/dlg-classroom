/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../../../models/db.js';
import utils from '../../../../models/utils.js';
import icon from '../../../../models/icon.js';
import '../../Admin.css';

class Devices extends Component {
    constructor(props) {
        super(props);
        this.change = this.change.bind(this);
        this.state = {
            title: this.props.category,
            control: {
                deviceCategories: []
            }
        };
    }

    componentDidMount() {
        this.getCategories();
    }

    async getCategories() {
        this.setState({
            control: {
                deviceCategories: await this.deviceCategories()
            }
        })
    }

    deviceCategories() {
        let res = db.fetchAll("device/category");
        let that = this;

        return res.then(function(data) {
            let categories = data.map(function(cat) {
                let view = () => that.deviceCategoriesView(cat.name);
                let key = `device-category-${cat.name}`;

                return [
                    <figure className="center">
                        { icon.get(cat.name, view) }
                        <figcaption>
                            { cat.name }
                        </figcaption>
                    </figure>
                ];
            });
            return categories;
        });
    }

    deviceCategoriesView(category) {
        let view;
        // let view = <Devices category={ category }/>;

        this.change(view);
    }

    change(view) {
        this.setState({
            view: view
        });
    }

    render() {
        return (
            <div className="page-wrapper">
                <h2 className="center">Device kategorier</h2>
                <div className="admin-control category-view">
                    { this.state.control.deviceCategories }
                </div>
            </div>
        );
    }
}

export default withRouter(Devices);

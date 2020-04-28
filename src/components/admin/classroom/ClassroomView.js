/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../../models/db.js';
import icon from '../../../models/icon.js';
import '../Admin.css';
import Categories from '../../filter/Categories.js';
import ClassroomCards from '../../classroom/ClassroomCards.js';

class ClassroomView extends Component {
    constructor(props) {
        super(props);
        this.filter = this.filter.bind(this);
        this.toggleFilter = this.toggleFilter.bind(this);
        this.state = {
            title: "Visa Klassrum",
            toggle: window.innerWidth <= 900 ? "close" : "open",
            data: [],
            filter: {},
            selection: [
                ["name-caption-large", null],
                ["manage", null]
            ]
        };
    }

    componentDidMount() {
        let state = this.props.restore("classroomViewState");

        if (state) {
            this.setState(state, () => this.loadClassroom(this.state.filter));
        } else {
            this.loadClassroom(this.state.filter);
        }
    }

    componentWillUnmount() {
        this.props.save("classroomViewState", this.state);
    }

    loadClassroom(filter) {
        let res = db.fetchAllManyWhere("classroom", filter);

        res.then((data) => {
            this.setState({
                data: data,
                filter: filter
            }, () => this.classrooms.updateData(data));
        });
    }

    filter(category, filter) {
        let currentFilter = this.state.filter;

        currentFilter[category] = filter;

        this.setState({
            filter: currentFilter
        }, () => this.loadClassroom(this.state.filter));
    }

    toggleFilter() {
        this.setState({
            toggle: this.state.toggle === "close" ? "open" : "close"
        });
    }

    render() {
        return (
            <article>
                <div className={`filter-panel ${ this.state.toggle }`}>
                    <div className="dropdown">
                        { icon.get(this.state.toggle === "close" ? "Drop-down" : "Drop-up", this.toggleFilter) }
                    </div>
                    <Categories
                        title="Filter Hus"
                        filterCb={ this.filter }
                        url="classroom/building"
                        category="building"
                        stateName="classroomCategory1"
                        save={ this.props.save }
                        restore={ this.props.restore }
                    />

                    <Categories
                        title="Filter Status"
                        filterCb={ this.filter }
                        url="report/filter"
                        category="solved"
                        stateName="classroomCategory2"
                        save={ this.props.save }
                        restore={ this.props.restore }
                    />
                </div>

                <ClassroomCards
                    onRef={ref => (this.classrooms = ref)}
                    classrooms={ this.state.data }
                    choice={ ["status", "view", "edit", "delete"] }
                    selection={ this.state.selection }
                />
            </article>
        );
    }
}

export default withRouter(ClassroomView);

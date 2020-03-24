import utils from './utils.js';
import React, { Component } from 'react';
import TheatersIcon from '@material-ui/icons/Theaters';
import TvIcon from '@material-ui/icons/Tv';
import SpeakerIcon from '@material-ui/icons/Speaker';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import AddBoxIcon from '@material-ui/icons/AddBox';
import EditIcon from '@material-ui/icons/Edit';
import SwapVerticalCircleIcon from '@material-ui/icons/SwapVerticalCircle';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import SelectAllIcon from '@material-ui/icons/SelectAll';

import classroom from '../assets/img/icons/classroom.png';
import device from '../assets/img/icons/device.png';
import classroomDevice from '../assets/img/icons/classroom-device.png'
// Icon helper
const icon = {
    cat: {
        "Projektor": [
            <TheatersIcon fontSize="large" />
        ],
        "Högtalare": [
            <SpeakerIcon fontSize="large" />
        ],
        "TV": [
            <TvIcon fontSize="large" />
        ],
        "Skärm": [
            <TvIcon fontSize="large" />
        ],
        "View": [
            <VisibilityIcon fontSize="large" />
        ],
        "Up": [
            <ArrowUpwardIcon fontSize="large" />
        ],
        "Down": [
            <ArrowDownwardIcon fontSize="large" />
        ],
        "Add": [
            <AddBoxIcon fontSize="large" />
        ],
        "Edit": [
            <EditIcon fontSize="large" />
        ],
        "Delete": [
            <DeleteIcon fontSize="large" />
        ],
        "Swap": [
            <SwapVerticalCircleIcon fontSize="large" />
        ],
        "Building": [
            <HomeWorkIcon fontSize="large" />
        ],
        "All": [
            <SelectAllIcon fontSize="large" />
        ],
        "Classroom": [
            <img src={ classroom } className="icon" />
        ],
        "Device": [
            <img src={ device } className="icon" />
        ],
        "classroomDevice": [
            <img src={ classroomDevice } className="icon" />
        ]
    },
    get: function(name, callback = null, selected = null) {
        let icon;
        let element;

        if (name.includes("hus") || name === "Norra" || name === "Östra") {
            icon = this.cat["Building"];
        } else {
            icon = this.cat[name];
        }

        if (callback) {
            element = [
                <i
                    key={`icon-${name}`}
                    className={selected ? "selected" : "clickable" }
                    onClick={ callback }
                >
                { icon }
                </i>
            ]
        } else {
            element = [
                <i>{ icon }</i>
            ]
        }

        return element;
    }
};

export default icon;

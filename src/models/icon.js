import utils from './utils.js';
import React, { Component } from 'react';
import TheatersIcon from '@material-ui/icons/Theaters';
import TvIcon from '@material-ui/icons/Tv';
import SpeakerIcon from '@material-ui/icons/Speaker';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from "@material-ui/icons/DeleteForever";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

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
        "Delete": [
            <DeleteIcon fontSize="large" />
        ],
        "Up": [
            <ArrowUpwardIcon fontSize="large" />
        ],
        "Down": [
            <ArrowDownwardIcon fontSize="large" />
        ]
    },
    get: function(name, callback = null) {
        let icon = this.cat[name];
        let element;

        if (callback) {
            element = [
                <i className="clickable" onClick={ callback } >
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

import React, { Component } from 'react';
import TheatersIcon from '@material-ui/icons/Theaters';
import TvIcon from '@material-ui/icons/Tv';
import SpeakerIcon from '@material-ui/icons/Speaker';

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
        ]
    },
    get: function(name) {
        return this.cat[name];
    }
};

export default icon;

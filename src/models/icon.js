import React from 'react';
import TheatersIcon from '@material-ui/icons/Theaters';
import TvIcon from '@material-ui/icons/Tv';
import AppleIcon from '@material-ui/icons/Apple';
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
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RoomIcon from '@material-ui/icons/Room';
import BuildIcon from '@material-ui/icons/Build';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';

import house from '../assets/img/icons/house.png';
import classroom from '../assets/img/icons/classroom.png';
import device from '../assets/img/icons/device.png';
import classroomDevice from '../assets/img/icons/classroom-device.png';
import message from '../assets/img/icons/message.png';
import maintenance from '../assets/img/icons/maintenance.png';
import speaker from '../assets/img/icons/speaker.png';
import projector from '../assets/img/icons/projector.png';
import tv from '../assets/img/icons/tv.png';
import appleTV from '../assets/img/icons/apple-tv.png';
import user from '../assets/img/icons/user.png';

// Icon helper
const icon = {
    cat: {
        "OK": [
            <CheckCircleIcon className="check-icon" fontSize="large" color="disable" key="OK" />
        ],
        "Att göra": [
            <ErrorIcon fontSize="large" color="error" key="Broke" />
        ],
        "Projektor": [
            <TheatersIcon fontSize="large" key="Projektor" />
        ],
        "Högtalare": [
            <SpeakerIcon fontSize="large" key="Högtalare" />
        ],
        "TV": [
            <TvIcon fontSize="large" key="TV" />
        ],
        "Apple TV": [
            <AppleIcon fontSize="large" key="Apple TV" />
        ],
        "Skärm": [
            <TvIcon fontSize="large" key="Skärm" />
        ],
        "Projektor-large": [
            <img src={ projector } className="icon" alt="icon" key="Projektor-large" />
        ],
        "Högtalare-large": [
            <img src={ speaker } className="icon" alt="icon" key="Högtalare-large" />
        ],
        "TV-large": [
            <img src={ tv } className="icon" alt="icon" key="TV-large" />
        ],
        "Apple TV-large": [
            <img src={ appleTV } className="icon" alt="icon" key="Apple-TV-large" />
        ],
        "View": [
            <VisibilityIcon fontSize="large" key="View" />
        ],
        "Up": [
            <ArrowUpwardIcon fontSize="large" key="Up" />
        ],
        "Down": [
            <ArrowDownwardIcon fontSize="large" key="Down" />
        ],
        "Add": [
            <AddBoxIcon fontSize="large" key="Add" />
        ],
        "Edit": [
            <EditIcon fontSize="large" key="Edit" />
        ],
        "Delete": [
            <DeleteIcon fontSize="large" key="Delete" />
        ],
        "Swap": [
            <SwapVerticalCircleIcon fontSize="large" key="Swap" />
        ],
        "Building": [
            <HomeWorkIcon fontSize="large" key="Building" />
        ],
        "Alla": [
            <SelectAllIcon fontSize="large" key="Alla" />
        ],
        "Working": [
            <CheckCircleIcon className="check-icon" fontSize="large" color="disable" key="Working" />
        ],
        "Broke": [
            <ErrorIcon fontSize="large" color="error" key="Broke" />
        ],
        "Room": [
            <RoomIcon fontSize="large" key="Room" />
        ],
        "Classroom2": [
            <HomeWorkIcon fontSize="large" key="Classroom2" />
        ],
        "Build": [
            <BuildIcon fontSize="large" key="Build" />
        ],
        "Drop-down": [
            <ArrowDropDownIcon fontSize="large" key="Drop-down" />
        ],
        "Drop-up": [
            <ArrowDropUpIcon fontSize="large" key="Drop-up" />
        ],
        "Level": [
            <SupervisorAccountIcon fontSize="large" key="Level" />
        ],
        "House": [
            <img src={ house } className="icon" alt="icon" key="House" />
        ],
        "Classroom": [
            <img src={ classroom } className="icon" alt="icon" key="Classroom" />
        ],
        "Classroom-large": [
            <img src={ classroom } className="icon" alt="icon" key="Classroom-large" />
        ],
        "Device": [
            <img src={ device } className="icon" alt="icon" key="Device" />
        ],
        "classroomDevice": [
            <img src={ classroomDevice } className="icon" alt="icon" key="classroomDevice" />
        ],
        "Message": [
            <img src={ message } className="icon" alt="icon" key="Message" />
        ],
        "Maintenance": [
            <img src={ maintenance } className="icon" alt="icon" key="Maintenance" />
        ],
        "User": [
            <img src={ user } className="icon" alt="icon" key="User" />
        ]
    },
    tooltip: {
        "Report": {
            "Working": "Inga felanmälningar",
            "Broke": "Visa felanmälningar",
        },
        "Classrooms": {
            "View": "Visa alla klassrum",
            "Add": "Lägg till nytt klassrum",
            "Edit": "Redigera ett klassrum",
            "Delete": "Radera ett klassrum"
        },
        "Classroom": {
            "View": "Visa klassrummet",
            "Edit": "Redigera klassrummet",
            "Delete": "Radera klassrummet"
        },
        "Devices": {
            "View": "Visa alla utrustning",
            "Add": "Lägg till ny utrustning",
            "Edit": "Redigera en utrustning",
            "Delete": "Radera en utrustning"
        },
        "Device": {
            "Report": "Visa status",
            "Build": "Felanmäl",
            "View": "Visa utrustningen",
            "Edit": "Redigera utrustningen",
            "Delete": "Radera utrustningen"
        },
        "Connect": {
            "Add": "Koppla utrustning till ett klassrum",
            "Swap": "Växla utrustning mellan klassrum"
        },
        "Reports": {
            "View": "Visa alla felanmälningar",
            "Edit": "Redigera en felanmälning",
            "Delete": "Radera en felanmälning"
        },
        "Person": {
            "Delete": "Radera en användare",
            "Level": "Ändra en användares behörighet"
        },
    },
    get: function(name, callback = null, selected = null, toggleHover = null, tooltip = null) {
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
                    className={ selected ? "selected" : "clickable" }
                    onClick={ callback }
                    onMouseEnter={ toggleHover ? () => toggleHover(this.tooltip[tooltip][name]) : null }
                    onMouseLeave={ toggleHover ? () => toggleHover(null) : null }
                >
                { icon }
                </i>
            ]
        } else {
            element = [
                <i key={`icon-${name}`}>{ icon }</i>
            ]
        }

        return element;
    },
    reportStatus: function(callback, working, toggleHover = null) {
        let icon;

        if (!working) {
            icon = this.cat["Broke"];
        } else {
            icon = this.cat["Working"];
        }

        let element = [
            <i
                key={`icon-Report`}
                className="clickable"
                onClick={ callback }
                onMouseEnter={ toggleHover ? () => toggleHover(this.tooltip["Report"][!working ? "Broke" : "Working"]) : null }
                onMouseLeave={ toggleHover ? () => toggleHover(null) : null }
            >
            { icon }
            </i>
        ]

        return element;
    },
    getFigure: function(name, callback = null, selected = null) {
        let icon;
        let element;

        if (name.includes("hus") || name === "Norra" || name === "Östra") {
            icon = this.cat["Building"];
        } else {
            icon = this.cat[name];
        }

        if (callback) {
            element = [
                <figure
                    key={`icon-${name}`}
                    className={selected ? "selected" : "clickable" }
                    onClick={ callback }
                >
                { icon }
                    <figcaption>
                        { name }
                    </figcaption>
                </figure>
            ]
        } else {
            element = [
                <figure key={`icon-${name}`}>
                    { icon }
                    <figcaption>
                        { name }
                    </figcaption>
                </figure>
            ]
        }

        return element;
    }
};

export default icon;

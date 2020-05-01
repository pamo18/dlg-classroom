/* eslint-disable react/jsx-no-target-blank */

import React from 'react';
import  { withRouter } from 'react-router-dom';
import icon from './icon.js';
import utils from './utils.js';

// Table helper
const table = {
    deviceHead: function(selection) {
        let rows = {
            "category": (w) => <th key="head-category" width={w}>Kategori</th>,
            "category-caption-simple": (w) => <th key="head-category-caption-simple" width={w}>Kategori</th>,
            "category-caption-advanced": (w) => <th key="head-category-caption-advanced" width={w}>Kategori</th>,
            "name": (w) => <th key="head-name" width={w}>Namn</th>,
            "brand": (w) => <th key="head-brand" width={w}>Märke</th>,
            "model": (w) => <th key="head-catmodelegory" width={w}>Modell</th>,
            "serial": (w) => <th key="head-serial" width={w}>Serial Nummer</th>,
            "purchased": (w) => <th key="head-purchased" width={w}>Köpt</th>,
            "price": (w) => <th key="head-price" width={w}>Pris</th>,
            "link": (w) => <th key="head-link" width={w}>Länk URL</th>,
            "classroom": (w) => <th key="head-classroom" width={w}>Klassrum</th>,
            "manage": (w) => <th key="head-manage" width={w}>Hantera</th>
        }

        return [
            <tr key={ "device-head" }>
                {
                    selection.map(choice => {
                        let heading = rows[choice[0]];
                        return heading(choice[1]);
                    })
                }
            </tr>
        ]
    },
    deviceBody: function(device, selection, actions = null, tooltip = null) {
        let rows = {
            "category": <td key="body-category" data-title="Kategori">{ icon.get(device.category)}</td>,
            "category-caption-simple": [
                <td key="body-category-caption-simple" data-title="Kategori">
                    <figure className="icon-text">
                        { icon.get(`${device.category}-large`)}
                        <figcaption>
                            <span className="caption-text">
                                { `${ device.category }` }<br />
                                { `${ device.brand } ${ device.model }` }
                            </span>
                        </figcaption>
                    </figure>
                </td>
            ],
            "category-caption-advanced": [
                <td key="body-category-caption-advanced" data-title="Kategori">
                    <figure className="icon-text">
                        { icon.get(`${device.category}-large`)}
                        <figcaption>
                            <span className="caption-text">
                                { `${ device.brand } ${ device.model }` }<br />
                                { `${ device.classroom_name ?? "Ledig" }` }
                            </span>
                        </figcaption>
                    </figure>
                </td>
            ],
            "name": <td key="body-name" data-title="Namn">{ `${ device.brand } ${ device.model }` }</td>,
            "brand": <td key="body-brand" data-title="Märke">{ device.brand }</td>,
            "model": <td key="body-model" data-title="Modell">{ device.model }</td>,
            "serial": <td key="body-serial" data-title="Serial">{ device.serialnum }</td>,
            "purchased": <td key="body-purchased" data-title="Köpt">{ new Date(device.purchased).toISOString().substring(0, 10) }</td>,
            "classroom": <td key="body-classroom" data-title="Klassrum">{ device.classroom_name || "-" }</td>,
            "price": <td key="body-price" data-title="Pris">{ device.price }:-</td>,
            "link": <td key="body-link" data-title="Länk"><a href={ device.url } target="_blank">Till produktsida</a></td>,
            "manage": (
                <td key="body-manage" data-title="Hantera">
                    { actions }
                    <div className="tooltip">
                        <div className="tooltip-text">
                            { tooltip ?? <span className="tooltip-placeholder">Välj verktyg</span> }
                        </div>
                    </div>
                </td>
            )
        }


        return [
            <div className="card-row">
                <tr key={ `device-body-${device.id}` }>
                    {
                        selection.map(choice => {
                            return rows[choice[0]];
                        })
                    }
                </tr>
            </div>
        ]

    },
    classroomHead: function(selection) {
        let rows = {
            "name": (w) => <th key="head-name" width={w}>Namn</th>,
            "name-caption-large": (w) => <th key="head-name-caption-large" width={w}>Namn</th>,
            "category": (w) => <th key="head-category" width={w}>Kategori</th>,
            "type": (w) => <th key="head-type" width={w}>Typ</th>,
            "level": (w) => <th key="head-level" width={w}>Våning</th>,
            "building": (w) => <th key="head-building" width={w}>Hus</th>,
            "manage": (w) => <th key="head-manage" width={w}>Hantera</th>
        }

        return [
            <tr key={ "classroom-head" }>
                {
                    selection.map(choice => {
                        let heading = rows[choice[0]];
                        return heading(choice[1]);
                    })
                }
            </tr>
        ]
    },
    classroomBody: function(classroom, selection, actions = null, tooltip =  null) {
        let rows = {
            "name": <td key="body-name" data-title="Namn">{ classroom.name }</td>,
            "name-caption-large": [
                <td key="body-name-caption-large" data-title="Namn">
                    <figure className="icon-text">
                        { icon.get("Classroom-large")}
                        <figcaption>
                            <span className="caption-text">
                                { "Klassrum" }<br />
                                { classroom.name }
                            </span>
                        </figcaption>
                    </figure>
                </td>
            ],
            "category": <td key="body-category" data-title="Kategori">{ icon.get("Build")}</td>,
            "type": <td key="body-type" data-title="Typ">{ classroom.type }</td>,
            "level": <td key="body-level" data-title="Våning">{ classroom.level }</td>,
            "building": <td key="body-building" data-title="Hus">{ classroom.building }</td>,
            "manage": (
                <td key="body-manage" data-title="Hantera">
                    { actions }
                    <div className="tooltip">
                        <div className="tooltip-text">
                            { tooltip ?? <span className="tooltip-placeholder">Välj verktyg</span> }
                        </div>
                    </div>
                </td>
                )
        };

        return [
            <div className="card-row">
                <tr key={ `classroom-body-${classroom.id}` }>
                    {
                        selection.map(function(choice) {
                            return rows[choice[0]];
                        })
                    }
                </tr>
            </div>
        ]
    },
    reportHead: function(selection) {
        let rows = {
            "item": (w) => <th key="head-item" width={w}>Vad</th>,
            "item-category": (w) => <th key="head-item-category" width={w}>Vad</th>,
            "item-category-simple": (w) => <th key="head-item-category-simple" width={w}>Vad</th>,
            "title": (w) => <th key="head-title" width={w}>Titel</th>,
            "message": (w) => <th key="head-message" width={w}>Meddeland</th>,
            "classroom": (w) => <th key="head-classroom" width={w}>Klassrum</th>,
            "created": (w) => <th key="head-created" width={w}>Skapad</th>,
            "action": (w) => <th key="head-action" width={w}>Åtgärdning</th>,
            "solved": (w) => <th key="head-solved" width={w}>Åtgärdat</th>,
            "person": (w) => <th key="head-person" width={w}>Person</th>,
            "manage": (w) => <th key="head-manage" width={w}>Hantera</th>
        };

        return [
            <tr key={ "report-head" }>
            {
                selection.map(function(choice) {
                    let heading = rows[choice[0]];
                    return heading(choice[1]);
                })
            }
            </tr>
        ]
    },
    reportBody: function(report, selection, that, actions = null) {
        let rows = {
            "item": [
                <td key="body-item" data-title="Vad">
                    <figure className="icon-text">
                        { icon.get("View", () => utils.redirect(that, `/${ report.item_group }`, { id: report.item_id })) }
                        <figcaption>
                            <span className="caption-text">
                                { report.item_group === "device" ? `${ report.classroom_name } - ${ report.device_brand } ${ report.device_model }` : `${ report.classroom_name } - Allämnt` }
                            </span>
                        </figcaption>
                    </figure>
                </td>
            ],
            "item-category": [
                <td key="body-item-category" data-title="Vad">
                    <figure className="icon-text">
                        { icon.get(report.device_category || "Build")}
                        <figcaption>
                            <span className="caption-text">
                                { report.device_id
                                    ?
                                    <span>{ `${report.device_brand} ${report.device_model}` }<br/>{ report.classroom_name }</span>
                                    :
                                    <span>{ report.classroom_name }</span>
                                }
                            </span>
                        </figcaption>
                    </figure>
                </td>
            ],
            "item-category-simple": [
                <td key="body-item-category-simple" data-title="Vad">
                    <figure className="icon-text">
                        { icon.get(report.device_category || "Build")}
                        <figcaption>
                            <span className="caption-text">
                                { report.device_id ? `${ report.device_category }` : report.classroom_name }
                            </span>
                        </figcaption>
                    </figure>
                </td>
            ],
            "title": <td key="body-title" data-title="Titel">{ report.name }</td>,
            "message": <td key="body-message" data-title="Meddelande">{ report.message }</td>,
            "classroom": [
                <td key="body-classroom" data-title="Klassrum">
                    <figure className="icon-text">
                        { icon.get("View", () => utils.redirect(that, `/classroom`, { id: report.classroom_id })) }
                        <figcaption>
                            <span className="caption-text">
                                { report.classroom_name }
                            </span>
                        </figcaption>
                    </figure>
                </td>
            ],
            "created": <td key="body-created" data-title="Skapad">{ report.created ? utils.convertSqlDate(report.created).substring(0, 10) : "-" }</td>,
            "action": <td key="body-action" data-title="Åtgärdning">{ report.action || "-" }</td>,
            "solved": <td key="body-solved" data-title="Åtgärdat">{ report.solved ? utils.convertSqlDate(report.solved).substring(0, 10) : "-" }</td>,
            "person": <td key="body-person" data-title="Person">{ report.person }</td>,
            "manage": <td key="body-manage" data-title="Hantera">{ actions }</td>
        };

        return [
            <tr key={ `report-body-${report.id}` }>
            {
                selection.map(function(choice) {
                    return rows[choice[0]];
                })
            }
            </tr>
        ]
    }
};

export default withRouter(table);

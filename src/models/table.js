import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import icon from './icon.js';
import utils from './utils.js';
import db from './db.js';

// Table helper
const table = {
    deviceHead: function(selection) {
        let rows = {
            "category": (w) => <th width={w}>Kategori</th>,
            "brand": (w) => <th width={w}>Märke</th>,
            "model": (w) => <th width={w}>Modell</th>,
            "serial": (w) => <th width={w}>Serial Nummer</th>,
            "purchased": (w) => <th width={w}>Köpt</th>,
            "price": (w) => <th width={w}>Pris</th>,
            "link": (w) => <th width={w}>Länk URL</th>,
            "classroom": (w) => <th width={w}>Klassrum</th>,
            "manage": (w) => <th width={w}>Hantera</th>
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
    deviceBody: function(device, selection, actions = null) {
        let rows = {
            "category": <td data-title="Kategori">{ icon.get(device.category)}</td>,
            "brand": <td data-title="Märke">{ device.brand }</td>,
            "model": <td data-title="Modell">{ device.model }</td>,
            "serial": <td data-title="Serial">{ device.serialnum }</td>,
            "purchased": <td data-title="Köpt">{ new Date(device.purchased).toISOString().substring(0, 10) }</td>,
            "classroom": <td data-title="Klassrum">{ device.classroom_name || "-" }</td>,
            "price": <td data-title="Pris">{ device.price }:-</td>,
            "link": <td data-title="Länk"><a href={ device.url } target="_blank">Till produktsida</a></td>,
            "manage": <td data-title="Hantera">{ actions }</td>
        }


        return [
            <tr key={ `device-body-${device.id}` }>
                {
                    selection.map(choice => {
                        return rows[choice[0]];
                    })
                }
            </tr>
        ]

    },
    classroomHead: function(selection) {
        let rows = {
            "name": (w) => <th width={w}>Namn</th>,
            "type": (w) => <th width={w}>Typ</th>,
            "level": (w) => <th width={w}>Våning</th>,
            "location": (w) => <th width={w}>Hus</th>,
            "manage": (w) => <th width={w}>Hantera</th>
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
    classroomBody: function(classroom, selection, actions = null) {
        let rows = {
            "name": <td data-title="Name">{ classroom.name }</td>,
            "type": <td data-title="Typ">{ classroom.type }</td>,
            "level": <td data-title="Våning">{ classroom.level }</td>,
            "location": <td data-title="Hus">{ classroom.location }</td>,
            "manage": <td data-title="Hantera">{ actions }</td>
        };

        return [
            <tr key={ `classroom-body-${classroom.id}` }>
                {
                    selection.map(function(choice) {
                        return rows[choice[0]];
                    })
                }
            </tr>
        ]
    },
    reportHead: function(selection) {
        let len = selection.length;
        let rows = {
            "title": (w) => <th width={w}>Titel</th>,
            "message": (w) => <th width={w}>Meddeland</th>,
            "classroom": (w) => <th width={w}>Klassrum</th>,
            "item": (w) => <th width={w}>Vad</th>,
            "action": (w) => <th width={w}>Åtgärdning</th>,
            "solved": (w) => <th width={w}>Åtgärdat</th>,
            "manage": (w) => <th width={w}>Hantera</th>
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
            "title": <td data-title="Titel">{ report.name }</td>,
            "message": <td data-title="Meddelande">{ report.message }</td>,
            "classroom": [
                <td data-title="Klassrum">
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
            "item": [
                <td data-title="Vad">
                    <figure className="icon-text">
                        { icon.get("View", () => utils.redirect(that, `/${ report.item_group }`, { id: report.item_id })) }
                        <figcaption>
                            <span className="caption-text">
                                { report.item_group === "device" ? `${ report.device_brand } ${ report.device_model }` : "Allämnt" }
                            </span>
                        </figcaption>
                    </figure>
                </td>
            ],
            "action": <td data-title="Åtgärdat">{ report.action || "-" }</td>,
            "solved": <td data-title="Åtgärdat">{ report.solved || "-" }</td>,
            "manage": <td data-title="Hantera">{ actions }</td>
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

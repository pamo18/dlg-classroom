import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import icon from './icon.js';
import utils from './utils.js';

// Table helper
const table = {
    head: function(items) {
        let tableHead = items.map((item) => {
            return <th>{ item }</th>
        });

        return [
            <tr>{ tableHead }</tr>
        ]
    },
    body: function(items, data) {
        let tableBody = items.map((item) => {
            return <td data-title={ item }>{ data[item] }</td>
        });

        return [
            <tr>{ tableBody }</tr>
        ]
    },
    adminHeadDevice: function() {
        let head = [
            <tr>
                <th>Kategori</th>
                <th>Märke</th>
                <th>Modell</th>
                <th>Serial Nummer</th>
                <th>Pris</th>
                <th>Länk URL</th>
                <th>Hantera</th>
            </tr>
        ];

        return head;
    },
    adminRowDevice: function(key, device, actions) {
        let row = [
            <tr key={ key }>
                <td data-title="Kategori">{ icon.get(device.category)}</td>
                <td data-title="Märke">{ device.brand }</td>
                <td data-title="Modell">{ device.model }</td>
                <td data-title="Serial">{ device.serialnum }</td>
                <td data-title="Pris">{ device.price }:-</td>
                <td data-title="Länk"><a href={ device.url } target="_blank">Till produktsida</a></td>
                <td data-title="Hantera">
                    { actions }
                </td>
            </tr>
        ];

        return row;
    },
    userHeadDevice: function() {
        let head = [
            <tr>
                <th>Kategori</th>
                <th>Märke</th>
                <th>Modell</th>
                <th>Länk URL</th>
                <th>Hantera</th>
            </tr>
        ];

        return head;
    },
    userRowDevice: function(key, device, actions) {
        let row = [
            <tr key={ key }>
                <td data-title="Kategori">{ icon.get(device.category)}</td>
                <td data-title="Märke">{ device.brand }</td>
                <td data-title="Modell">{ device.model }</td>
                <td data-title="Länk"><a href={ device.url } target="_blank">Till produktsida</a></td>
                <td data-title="Hantera">
                    { actions }
                </td>
            </tr>
        ];

        return row;
    },
    userHeadClassroom: function() {
        return [
            <tr>
                <th>Namn</th>
                <th>Typ</th>
                <th>Våning</th>
                <th>Hus</th>
                <th>Hantera</th>
            </tr>
        ];
    },
    userRowClassroom: function(key, classroom, actions) {
        return [
            <tr key={ key }>
                <td data-title="Name">{ classroom.name }</td>
                <td data-title="Typ">{ classroom.type }</td>
                <td data-title="Våning">{ classroom.level }</td>
                <td data-title="Hus">{ classroom.location }</td>
                <td data-title="Hantera">
                    { actions }
                </td>
            </tr>
        ];
    },
    adminHeadReport: function() {
        let head = [
            <tr>
                <th width="25%">Titel</th>
                <th width="25%">Klassrum</th>
                <th width="25%">Vad</th>
                <th width="5%">Åtgärdat</th>
                <th width="20%">Hantera</th>
            </tr>
        ];

        return head;
    },
    adminRowReport: function(key, report, actions, that) {
        let row = [
            <tr key={ key }>
                <td data-title="Titel">{ report.name }</td>
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
                <td data-title="Åtgärdat">{ report.solved || "-" }</td>
                <td data-title="Hantera">
                    { actions }
                </td>
            </tr>
        ];

        return row;
    },
    userHeadReport: function() {
        let head = [
            <tr>
                <th width="20%">Titel</th>
                <th width="60%">Meddeland</th>
                <th width="20%">Åtgärdat</th>
            </tr>
        ];

        return head;
    },
    userRowReport: function(key, report) {
        let row = [
            <tr key={ key }>
                <td data-title="Titel">{ report.name }</td>
                <td data-title="Meddelande">{ report.message }</td>
                <td data-title="Åtgärdat">{ report.solved || "-" }</td>
            </tr>
        ];

        return row;
    },
};

export default withRouter(table);

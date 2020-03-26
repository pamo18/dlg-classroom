import React, { Component } from 'react';
import icon from './icon.js';

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
    }
};

export default table;

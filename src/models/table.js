import React, { Component } from 'react';
import icon from './icon.js';

// Table helper
const table = {
    adminHead: function() {
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
    adminRow: function(key, device, admin) {
        let row = [
            <tr key={ key }>
                <td data-title="Kategori">{ icon.get(device.category)}</td>
                <td data-title="Märke">{ device.brand }</td>
                <td data-title="Modell">{ device.model }</td>
                <td data-title="Serial">{ device.serialnum }</td>
                <td data-title="Pris">{ device.price }:-</td>
                <td data-title="Länk"><a href={ device.url } target="_blank">Till produktsida</a></td>
                <td data-title="Hantera">
                    { admin }
                </td>
            </tr>
        ];

        return row;
    },
    userHead: function() {
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
    userRow: function(key, device, extra) {
        let row = [
            <tr key={ key }>
                <td data-title="Kategori">{ icon.get(device.category)}</td>
                <td data-title="Märke">{ device.brand }</td>
                <td data-title="Modell">{ device.model }</td>
                <td data-title="Länk"><a href={ device.url } target="_blank">Till produktsida</a></td>
                <td data-title="Hantera">
                    { extra }
                </td>
            </tr>
        ];

        return row;
    }
};

export default table;

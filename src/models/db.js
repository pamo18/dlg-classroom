/** global: localStorage */
import base from '../config/api.js';
const api = base.api();

const db = {
    fetchAll: async function(table) {
        try {
            let res = await fetch(`${api}/${table}`);

            return await res.json();
        } catch(err) {
            console.error(err);
        }
    },
    fetchAllWhere: async function(table, where) {
        try {
            let res = await fetch(`${api}/${table}/view/${where}`);

            return await res.json();
        } catch(err) {
            console.error(err);
        }
    },
    fetchWhere: async function(table, where) {
        try {
            let res = await fetch(`${api}/${table}/view/${where}`);

            let data = await res.json();
            return data[0];
        } catch(err) {
            console.error(err);
        }
    },
    insert: async function(table, data) {
        try {
            let res = await fetch(`${api}/${table}/create`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return res.json();
        } catch(err) {
            console.log(err);
        }
    },
    update: async function(table, where, data) {
        try {
            let res = await fetch(`${api}/${table}/update/${where}`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return res.json();
        } catch(err) {
            console.log(err);
        }
    },
    delete: async function(table, where) {
        try {
            let res = await fetch(`${api}/${table}/delete/${where}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return res.json();
        } catch(err) {
            console.log(err);
        }
    }
};

export default db;
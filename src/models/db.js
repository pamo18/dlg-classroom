import base from '../config/api.js';
const api = base.api();

// Database helper
const db = {
    reportCheck: async function(item, value) {
        try {
            let res = await fetch(`${api}/report/check/${item}&${value}`);

            let data = await res.json();

            return data.length > 0;
        } catch(err) {
            console.error(err);
        }
    },
    fetchAll: async function(table) {
        try {
            let res = await fetch(`${api}/${table}`);

            return await res.json();
        } catch(err) {
            console.error(err);
        }
    },
    fetchAllWhere: async function(table, column, value) {
        try {
            let res = await fetch(`${api}/${table}/view/${column}&${value}`);

            return await res.json();
        } catch(err) {
            console.error(err);
        }
    },
    fetchWhere: async function(table, column, value) {
        try {
            let res = await fetch(`${api}/${table}/view/${column}&${value}`);

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

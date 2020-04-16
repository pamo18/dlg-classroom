import base from '../config/api.js';
const api = base.api();

// Database helper
const db = {
    auth: async function(token) {
        try {
            let res = await fetch(`${api}/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                }
            });

            return res.json();
        } catch(err) {
            console.log(err);
        }
    },
    register: async function(data) {
        try {
            let res = await fetch(`${api}/register`, {
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
    login: async function(data) {
        try {
            let res = await fetch(`${api}/login`, {
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
    reportCheck: async function(itemGroup, itemid) {
        try {
            let res = await fetch(`${api}/report/check/${itemGroup}/${itemid}`);

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
    fetchAllWhere: async function(table, column1, value1, column2 = null, value2 = null) {
        let res;

        try {
            if (column2 && value2) {
                res = await fetch(`${api}/${table}/view/${column1}/${value1}/${column2}/${value2}`);
            } else {
                res = await fetch(`${api}/${table}/view/${column1}/${value1}`);
            }

            return await res.json();
        } catch(err) {
            console.error(err);
        }
    },
    fetchAllManyWhere: async function(table, data) {
        try {
            let res = await fetch(`${api}/${table}/view/where`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return await res.json();
        } catch(err) {
            console.error(err);
        }
    },
    fetchWhere: async function(table, column, value) {
        try {
            let res = await fetch(`${api}/${table}/view/${column}/${value}`);

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

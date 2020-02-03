/** global: localStorage */
import base from '../config/api.js';
const api = base.api();

const db = {
    getClassrooms: function() {
        fetch(api + "/classroom")
            .then(res => res.json())
            .then(function(res) {
                console.log(res);
                return res;
            })
    }
};

export default db;

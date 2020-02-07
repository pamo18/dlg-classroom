/** global: localStorage */
import base from '../config/api.js';
const api = base.api();

const db = {
    getClassrooms: async function() {
        try {
            let res = await fetch(api + "/classroom");

            return await res.json();
        } catch(err) {
            console.error(err);
        }
    },
    classroomDevices: async function(classroom) {
        try {
            let res = await fetch(api + "/classroom/device", {
                method: 'POST',
                body: JSON.stringify(classroom),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return await res.json();
        } catch(err) {
            console.error(err);
        }
    },
    getBuildnings: async function() {
        try {
            let res = await fetch(api + "/classroom/building");

            return await res.json();
        } catch(err) {
            console.error(err);
        }
    },
    getDeviceCategories: async function() {
        try {
            let res = await fetch(api + "/device/category");

            return await res.json();
        } catch(err) {
            console.error(err);
        }
    },
};

export default db;

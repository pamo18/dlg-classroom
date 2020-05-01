/* eslint-disable no-useless-rename */
import db from '../../../models/db.js';

function ItemData(itemGroup, itemid) {
    let res;

    switch(true) {
        case (itemGroup === "classroom"):
            res = db.fetchAllWhere("classroom", "classroom.id", itemid);
            break;
        case (itemGroup === "device"):
            res = db.fetchAllWhere("device", "device.id", itemid);
            break;
        default:
            return;
    }

    return res.then((data) => { return data[0] });
}

export default ItemData;

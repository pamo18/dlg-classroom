import utils from '../../../models/utils.js';
import icon from '../../../models/icon.js';
import table from '../../../models/table.js';
import { useAuth, useAdmin } from "../../auth/auth.js";

function ReportAdmin({
    that: that,
    id: id
    }) {
    const isAuthenticated = useAuth();
    const isAdmin = useAdmin();

    let edit = () => utils.redirect(that, `/admin/report/edit/${ id }`, {});
    let del = () => utils.redirect(that, `/admin/report/delete/${ id }`, {});

    let actions = [
        icon.get("Edit", edit),
        icon.get("Delete", del)
    ];

    return (
        isAuthenticated && isAdmin
            ?
            actions
            :
            null
    );
}

export default ReportAdmin;

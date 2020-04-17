import utils from '../../../models/utils.js';
import icon from '../../../models/icon.js';
import table from '../../../models/table.js';
import { useAuth, useAdmin } from "../../auth/auth.js";

function ReportAdmin({
    that: that,
    id: id
    }) {
    const { isAuth } = useAuth();
    const isAdmin = useAdmin();

    let view = () => utils.redirect(that, "/report/page", { id: id }, false);
    let actions = [
        icon.get("View", view)
    ];

    if (isAuth && isAdmin) {
        let edit = () => utils.redirect(that, `/admin/report/edit/${ id }`, {});
        let del = () => utils.redirect(that, `/admin/report/delete/${ id }`, {});

        actions.push(
            icon.get("Edit", edit),
            icon.get("Delete", del)
        );
    }

    return actions;
}

export default ReportAdmin;

/* eslint-disable no-useless-rename */

import React from "react";
import ErrorBoundary from './ErrorBoundary.js';
import { Route } from "react-router-dom";

function PublicRoute({
    path: path ,
    component: Component
    }) {

    return (
        <Route exact path={ path } render={ props => (
            <ErrorBoundary key={path}>
                <Component {...props} />
            </ErrorBoundary>
        )} />
    );
}

export default PublicRoute;

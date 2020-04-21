import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false
        };
}

static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {
        error: true
    };
}

componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    this.logErrorToMyService(error.toString(), info.componentStack);
}

logErrorToMyService = console.log

render() {
    if (this.state.error) {
        // You can render any custom fallback UI
        return <h1 class="center">Något gick fel.</h1>;
    }

    return this.props.children;
    }
}

export default ErrorBoundary;

import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/user.context';

/**
 * UserAuth is a component that protects routes requiring authentication.
 * If the user is not authenticated (determined by UserContext), it redirects
 * them to the landing page ('/').
 * It waits for the UserContext to finish its initial loading before making a decision.
 */
const UserAuth = ({ children }) => {
    // Retrieve user object and loading state from UserContext
    const { user, loading: userContextLoading } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();

    // useEffect to handle redirection logic based on authentication status
    React.useEffect(() => {
        // If UserContext is still loading, wait before making any decisions
        if (userContextLoading) {
            return;
        }

        // If UserContext has loaded and there is no authenticated user,
        // redirect to the landing page.
        // Pass the current location in state, so login page can redirect back if needed,
        // though current setup redirects to landing, then login, then home.
        if (!user) {
            navigate('/', { state: { from: location }, replace: true });
        }
        // If a user exists, this effect does nothing, allowing children to render.
    }, [user, userContextLoading, navigate, location]);

    // While UserContext is loading, display a loading indicator.
    if (userContextLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-50">
                <div className="text-lg font-medium text-slate-700">Loading...</div>
            </div>
        );
    }

    // If UserContext has loaded and the user is not authenticated,
    // useEffect will have initiated a navigation. Show a message or loader
    // during this brief period.
    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-50">
                <div className="text-lg font-medium text-slate-700">Redirecting...</div>
            </div>
        );
    }

    // If UserContext has loaded and the user is authenticated, render the children components.
    return <>{children}</>;
};

export default UserAuth;

import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';

const GuestRoute = ({ children }) => {

    const [loading, setLoading] = useState(true);
    const [authenticated, setauthenticated] = useState(false);

    useEffect(() => {


        const checkAuth = async () => {
            try {

                const response = await fetch(`http://localhost:5000/api/auth/profile`, {
                    method: "GET",
                    credentials: "include",

                });

                if (response.ok) {
                    setauthenticated(true);
                } else {
                    setauthenticated(false)
                }
                console.log("2. Backend status:", response.status);

            } catch (error) {
                console.error("Authentication check failed :", error);
                setauthenticated(false);
            } finally {
                setLoading(false);
            }


        }
        checkAuth()
    }, []);
    if (loading)
        return (


            <div>
                <p>
                    checking Authentication......
                </p>
            </div>
        )
    if (authenticated) {
        return <Navigate to='/dashboard' replace />;
    }
    return children;
}

export default GuestRoute
"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent) => {
    const WithAuth = (props) => {
        const router = useRouter();

        useEffect(() => {
            const checkAuth = async () => {
                const response = await fetch('/api/user/current-user');
                if (response.status === 401) {
                    router.push('/signin')
                }
            };

            checkAuth();
        }, [router]);

        return <Suspense fallback={<div></div>}><WrappedComponent {...props} /></Suspense>;
    }

    WithAuth.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || `Component`})`

    return WithAuth
}

export default withAuth;

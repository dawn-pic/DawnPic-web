'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent) => {
    return (props) => {
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

        return <WrappedComponent {...props} />;
    }
}

export default withAuth;

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        const performLogout = async () => {
            try {
                // Call logout API to clear cookie on server
                await fetch('/api/auth/logout', { method: 'POST' });
            } catch (err) {
                console.error('Logout API error:', err);
            }
            
            // Clear all persistent authentication data from localStorage
            localStorage.removeItem("authToken");
            localStorage.removeItem("webnovelUsername");
            localStorage.removeItem("webnovelName");
            localStorage.removeItem("webnovelAvatar");

            // Redirect to login
            router.replace("/login");
        };

        performLogout();
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <Spinner size={32} />
            <p className="mt-4 text-gray-600 font-medium">Signing out...</p>
        </div>
    );
}

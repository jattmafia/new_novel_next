"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        // Clear all persistent authentication data
        localStorage.removeItem("authToken");
        localStorage.removeItem("webnovelUsername");

        // Redirect to login immediately
        router.replace("/login");
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <Spinner size={32} />
            <p className="mt-4 text-gray-600 font-medium">Signing out...</p>
        </div>
    );
}

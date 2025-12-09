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

        // Optional: clear any other related items
        // localStorage.clear(); 

        // Redirect to login after a brief moment
        const timer = setTimeout(() => {
            router.replace("/login");
        }, 1000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <Spinner size={32} />
            <p className="mt-4 text-gray-600 font-medium">Signing out...</p>
        </div>
    );
}

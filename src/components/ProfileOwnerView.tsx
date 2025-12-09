"use client";

import { useEffect, useState, ReactNode } from "react";

export default function ProfileOwnerView({ username, children }: { username: string, children: ReactNode }) {
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        try {
            const token = localStorage.getItem("authToken");
            const stored = localStorage.getItem("webnovelUsername");
            if (token && stored === username) {
                setIsOwner(true);
            } else {
                setIsOwner(false);
            }
        } catch (e) {
            setIsOwner(false);
        }
    }, [username]);

    if (!isOwner) return null;

    return <>{children}</>;
}

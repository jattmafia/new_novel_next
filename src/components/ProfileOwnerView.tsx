"use client";

import { useEffect, useState, ReactNode } from "react";
import { useSessionSync } from "@/lib/SessionContext";

export default function ProfileOwnerView({ username, children }: { username: string, children: ReactNode }) {
    const [isOwner, setIsOwner] = useState(false);
    const { isSessionSynced } = useSessionSync();

    useEffect(() => {
        // Only check ownership after session has been synced
        if (!isSessionSynced) return;

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
    }, [username, isSessionSynced]);

    if (!isOwner) return null;

    return <>{children}</>;
}

"use client";

import { ReactNode, useEffect, useState } from "react";
import { useSessionSync } from "@/lib/SessionContext";

interface Props {
    username: string;
    children: ReactNode;
}

// Renders children only when the viewer is NOT the profile owner
export default function ProfileVisitorView({ username, children }: Props) {
    const { isSessionSynced } = useSessionSync();
    const [isVisitor, setIsVisitor] = useState<boolean | null>(null);

    useEffect(() => {
        if (!isSessionSynced) return;

        try {
            const stored = localStorage.getItem("webnovelUsername");
            if (stored && stored === username) {
                setIsVisitor(false);
            } else {
                setIsVisitor(true);
            }
        } catch (e) {
            setIsVisitor(true);
        }
    }, [username, isSessionSynced]);

    if (isVisitor === null) return null;
    if (!isVisitor) return null;

    return <>{children}</>;
}

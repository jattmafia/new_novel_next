"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface SessionContextType {
    isSessionSynced: boolean;
    markSessionSynced: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
    const [isSessionSynced, setIsSessionSynced] = useState(false);

    const markSessionSynced = useCallback(() => {
        setIsSessionSynced(true);
    }, []);

    return (
        <SessionContext.Provider value={{ isSessionSynced, markSessionSynced }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSessionSync() {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error("useSessionSync must be used within a SessionProvider");
    }
    return context;
}

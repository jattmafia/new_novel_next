"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSessionSync } from "@/lib/SessionContext";

export default function SessionSyncer() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { markSessionSynced } = useSessionSync();

    useEffect(() => {
        const syncToken = searchParams.get("s_token");
        const syncUser = searchParams.get("s_user");

        if (syncToken && syncUser) {
            try {
                localStorage.setItem("authToken", syncToken);
                localStorage.setItem("webnovelUsername", syncUser);

                // Mark session as synced before cleaning URL
                markSessionSynced();

                // Clean URL
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.delete("s_token");
                newUrl.searchParams.delete("s_user");

                router.replace(newUrl.pathname + newUrl.search);
            } catch (e) {
                console.error("Session sync failed", e);
                // Mark as synced even on error to prevent infinite waiting
                markSessionSynced();
            }
        } else {
            // No session params to sync, mark as ready immediately
            markSessionSynced();
        }
    }, [searchParams, router, markSessionSynced]);

    return null;
}

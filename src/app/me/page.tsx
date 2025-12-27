import { Suspense } from "react";
import ProfileSettingsPage from "@/components/ProfileSettingsPage";
import Spinner from "@/components/Spinner";

function LoadingFallback() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Spinner size={40} />
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <ProfileSettingsPage />
        </Suspense>
    );
}

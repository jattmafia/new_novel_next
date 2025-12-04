import CreateProfileForm from "@/components/CreateProfileForm";

export default function CreateProfilePage() {
    return (
        <div className="min-h-screen flex items-start justify-center bg-linear-to-b from-purple-50 via-white to-amber-50 py-20 px-4 relative overflow-hidden">
            {/* Subtle decorative blobs */}
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Card Container */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-purple-100/50">
                    {/* Decorative header line */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-linear-to-r from-amber-400 to-purple-500 rounded-full"></div>

                    {/* Header */}
                    <div className="mb-8 pt-4 text-center">
                        <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-amber-600 bg-clip-text text-transparent mb-2">
                            👤 Complete Your Profile
                        </h1>
                        <p className="text-gray-600 text-sm">Tell us a bit about yourself</p>
                    </div>

                    {/* Form */}
                    <CreateProfileForm />
                </div>
            </div>
        </div>
    );
}

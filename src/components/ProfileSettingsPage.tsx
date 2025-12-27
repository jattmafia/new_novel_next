"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { getMyProfile, updateMyProfile, UserProfile } from "@/lib/profileService";
import { useSessionSync } from "@/lib/SessionContext";
import Spinner from "@/components/Spinner";
import { imageUrl } from "@/lib/config";
import { Camera, Mail, MapPin, Award, CheckCircle, AlertCircle, Save } from "lucide-react";

export default function ProfileSettingsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isSessionSynced } = useSessionSync();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [profileData, setProfileData] = useState<UserProfile | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        gender: "other" as "male" | "female" | "other",
        dob: "",
        bio: "",
        location: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            // Wait for session sync
            if (!isSessionSynced) {
                console.log("[ProfileSettingsPage] Waiting for session sync...");
                return;
            }

            console.log("[ProfileSettingsPage] Session synced, fetching profile...");

            // Fetch profile using token from localStorage
            try {
                setLoading(true);
                console.log("[ProfileSettingsPage] Calling getMyProfile()...");
                const responseData = await getMyProfile();
                console.log("[ProfileSettingsPage] Profile data received:", responseData);
                
                // Handle potential nested response (e.g., { status: 'success', data: { ... } })
                const data = (responseData as any).data || (responseData as any).user || responseData;
                
                setProfileData(data);
                setFormData({
                    name: data.name || "",
                    username: data.profile?.username || "",
                    email: data.email || "",
                    gender: data.gender || "other",
                    dob: data.dob ? data.dob.split("T")[0] : "",
                    bio: data.profile?.bio || "",
                    location: data.profile?.location || "",
                });
            } catch (err) {
                const errorMsg = err instanceof Error ? err.message : "Failed to load profile";
                console.error("[ProfileSettingsPage] Error fetching profile:", err);
                console.error("[ProfileSettingsPage] Error message:", errorMsg);
                setError(errorMsg);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [isSessionSynced]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const responseData = await updateMyProfile({
                name: formData.name,
                username: formData.username,
                gender: formData.gender,
                dob: formData.dob,
                bio: formData.bio,
                location: formData.location,
                profilePicture: selectedFile || undefined,
            });

            // Handle potential nested response
            const data = (responseData as any).data || (responseData as any).user || responseData;
            
            // Update local state to reflect changes immediately
            setProfileData(data);
            
            // If username or name changed, update localStorage
            if (data.profile?.username) {
                localStorage.setItem("webnovelUsername", data.profile.username);
            }
            if (data.name) {
                localStorage.setItem("webnovelName", data.name);
            }

            // Dispatch event to notify other components (like Navbar)
            window.dispatchEvent(new Event("profileUpdated"));

            setSuccess("Profile updated successfully!");
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Spinner />
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">Profile Not Found</h1>
                    <p className="text-gray-600">Unable to load your profile information.</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Profile Settings
                    </h1>
                    <p className="text-gray-600">Manage your account information and preferences</p>
                </div>

                {/* Alert Messages */}
                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-red-900">Error</h3>
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-green-900">Success</h3>
                            <p className="text-green-700 text-sm">{success}</p>
                        </div>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar - Profile Picture & Status */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
                            {/* Avatar */}
                            <div className="mb-6">
                                <div className="relative inline-block w-full">
                                    <div className="w-full aspect-square rounded-xl bg-gray-100 flex items-center justify-center text-6xl font-bold text-gray-400 overflow-hidden border border-gray-100">
                                        {previewUrl ? (
                                            <Image
                                                src={previewUrl}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : profileData.profile.profilePicture ? (
                                            <Image
                                                src={imageUrl(profileData.profile.profilePicture) || ""}
                                                alt={profileData.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <span>{profileData.name.charAt(0).toUpperCase()}</span>
                                        )}
                                    </div>
                                    <label className="absolute bottom-2 right-2 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                                        <Camera className="w-5 h-5 text-purple-600" />
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Name & Username */}
                            <div className="text-center mb-8">
                                <h2 className="text-xl font-bold text-gray-900 truncate">
                                    {profileData.name || "No Name Set"}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    @{profileData.profile.username}
                                </p>
                            </div>

                            {/* Status Badges */}
                            <div className="space-y-3">
                                {/* Email Verification */}
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 border border-gray-100">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-tight">Email</p>
                                        <p className="text-xs text-gray-700 font-medium">
                                            {profileData.isEmailVerified ? "Verified" : "Not verified"}
                                        </p>
                                    </div>
                                    {profileData.isEmailVerified && (
                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    )}
                                </div>

                                {/* Subscription Status */}
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 border border-gray-100">
                                    <Award className="w-4 h-4 text-gray-400" />
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-tight">Subscription</p>
                                        <p className="text-xs text-gray-700 font-medium capitalize">
                                            {profileData.profile.subscriptionStatus}
                                        </p>
                                    </div>
                                    {profileData.profile.isVerified && (
                                        <CheckCircle className="w-4 h-4 text-amber-500" />
                                    )}
                                </div>

                                {/* Member Since */}
                                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-tight">Member Since</p>
                                    <p className="text-xs text-gray-700 font-medium">
                                        {new Date(profileData.createdAt).toLocaleDateString("en-US", {
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>

                                {/* Reputation */}
                                {profileData.profile.reputation > 0 && (
                                    <div className="p-3 rounded-lg bg-amber-50">
                                        <p className="text-xs font-semibold text-amber-700">Reputation</p>
                                        <p className="text-xs text-amber-600">{profileData.profile.reputation}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Form */}
                    <div className="md:col-span-3">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Personal Information Section */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    Personal Information
                                </h2>

                                <div className="space-y-6">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all shadow-sm"
                                            placeholder="Your full name"
                                        />
                                    </div>

                                    {/* Username */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Username
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">@</span>
                                            <input
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all shadow-sm"
                                                placeholder="username"
                                            />
                                        </div>
                                    </div>

                                    {/* Email (Read-only) */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            disabled
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed font-medium"
                                        />
                                        <p className="text-xs text-gray-500 mt-2">
                                            Email cannot be changed. Contact support if needed.
                                        </p>
                                    </div>

                                    {/* Gender & DOB */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Gender
                                            </label>
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all shadow-sm"
                                            >
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Date of Birth
                                            </label>
                                            <input
                                                type="date"
                                                name="dob"
                                                value={formData.dob}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Information Section */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    Profile Information
                                </h2>

                                <div className="space-y-6">
                                    {/* Bio */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Bio
                                        </label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all shadow-sm resize-none"
                                            placeholder="Tell us about yourself..."
                                        />
                                        <p className="text-xs text-gray-500 mt-2">
                                            {formData.bio.length}/500 characters
                                        </p>
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all shadow-sm"
                                            placeholder="City, Country"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="px-6 py-3 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="w-5 h-5" />
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}

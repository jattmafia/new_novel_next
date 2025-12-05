"use client";

import { useState, FormEvent, ChangeEvent, useEffect, useRef } from "react";
import Image from "next/image";
import { createProfile, checkUsernameAvailability } from "@/lib/authService";
import Spinner from "@/components/Spinner";

export default function CreateProfileForm() {
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [usernameStatus, setUsernameStatus] = useState<"" | "checking" | "available" | "taken" | "invalid">("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const usernameCheckTimeout = useRef<NodeJS.Timeout | null>(null);

    // Check username availability with debouncing
    useEffect(() => {
        if (usernameCheckTimeout.current) {
            clearTimeout(usernameCheckTimeout.current);
        }

        if (!username.trim()) {
            setUsernameStatus("");
            setUsernameMessage("");
            return;
        }

        // Basic validation
        if (username.length < 3 || username.length > 20) {
            setUsernameStatus("invalid");
            setUsernameMessage("Username must be 3-20 characters");
            return;
        }

        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            setUsernameStatus("invalid");
            setUsernameMessage("Only letters, numbers, hyphens, and underscores allowed");
            return;
        }

        // Debounce API call
        setUsernameStatus("checking");
        usernameCheckTimeout.current = setTimeout(async () => {
            try {
                const result = await checkUsernameAvailability(username);
                if (result.error) {
                    setUsernameStatus("invalid");
                    setUsernameMessage(result.error);
                } else if (result.available) {
                    setUsernameStatus("available");
                    setUsernameMessage("✅ Username available!");
                } else {
                    setUsernameStatus("taken");
                    setUsernameMessage("❌ Username already taken");
                }
            } catch (error) {
                setUsernameStatus("invalid");
                setUsernameMessage(error instanceof Error ? error.message : "Failed to check username");
            }
        }, 500);

        return () => {
            if (usernameCheckTimeout.current) {
                clearTimeout(usernameCheckTimeout.current);
            }
        };
    }, [username]);

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setErrors({ ...errors, image: "Please upload an image file" });
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrors({ ...errors, image: "Image must be less than 5MB" });
            return;
        }

        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfilePicturePreview(reader.result as string);
            setErrors({ ...errors, image: "" });
        };
        reader.readAsDataURL(file);
        setProfilePictureFile(file);
    };

    const removeImage = () => {
        setProfilePicturePreview(null);
        setProfilePictureFile(null);
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!username.trim()) {
            newErrors.username = "Username is required";
        } else if (usernameStatus === "checking") {
            newErrors.username = "Please wait while we check username availability";
        } else if (usernameStatus === "taken") {
            newErrors.username = "Username is already taken";
        } else if (usernameStatus === "invalid") {
            newErrors.username = usernameMessage || "Username is invalid";
        } else if (usernameStatus !== "available") {
            newErrors.username = "Please wait to verify username";
        }

        if (!bio.trim()) {
            newErrors.bio = "Bio is required";
        } else if (bio.length < 10) {
            newErrors.bio = "Bio must be at least 10 characters";
        } else if (bio.length > 200) {
            newErrors.bio = "Bio must be less than 200 characters";
        }

        if (!profilePicturePreview) {
            newErrors.image = "Profile picture is required";
        }

        return newErrors;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        // Validate form
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsLoading(false);
            return;
        }

        setErrors({});

        try {
            // Get auth token from localStorage
            const token = localStorage.getItem("authToken");
            if (!token) {
                setErrors({ submit: "Authentication token not found. Please login again." });
                setIsLoading(false);
                return;
            }

            // Call backend API
            const response = await createProfile(username, bio, profilePictureFile, token);

            if (response.success) {
                alert(`🎉 Profile created! Welcome @${username}!`);

                // Reset form
                setUsername("");
                setBio("");
                setProfilePicturePreview(null);
                setProfilePictureFile(null);

                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 500);
            }
        } catch (error) {
            setErrors({ submit: error instanceof Error ? error.message : "Profile creation failed" });
            console.error("Profile creation error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on">
            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                    📷 Profile Picture
                </label>

                <div className="relative">
                    {profilePicturePreview ? (
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-200 shadow-lg">
                                <Image
                                    src={profilePicturePreview}
                                    alt="Profile preview"
                                    width={128}
                                    height={128}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors shadow-lg"
                                disabled={isLoading}
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <label className="w-32 h-32 rounded-full border-4 border-dashed border-purple-300 hover:border-purple-400 flex flex-col items-center justify-center cursor-pointer bg-purple-50/50 transition-all hover:bg-purple-100/50">
                            <span className="text-4xl mb-1">📸</span>
                            <span className="text-xs text-gray-600 font-medium">Upload</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={isLoading}
                            />
                        </label>
                    )}
                </div>
                {errors.image && <p className="text-red-600 text-sm mt-2 font-medium">{errors.image}</p>}
                <p className="text-xs text-gray-500 mt-2">Max 5MB • JPG, PNG, GIF</p>
            </div>

            {/* Username Field */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label htmlFor="username" className="text-sm font-semibold text-gray-700">
                        👤 Username
                    </label>
                    {usernameStatus === "checking" && <Spinner size={14} />}
                </div>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">@</span>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="off"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="yourname"
                        className={`w-full pl-8 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-black ${errors.username
                            ? "border-red-500 focus:ring-red-500 bg-red-50/30"
                            : usernameStatus === "available"
                                ? "border-emerald-500 focus:ring-emerald-500 bg-emerald-50/30"
                                : usernameStatus === "taken"
                                    ? "border-orange-500 focus:ring-orange-500 bg-orange-50/30"
                                    : "border-purple-200 focus:ring-purple-500 focus:border-purple-500 bg-purple-50/30 hover:border-purple-300"
                            }`}
                        disabled={isLoading}
                        maxLength={20}
                    />
                </div>
                {usernameMessage && usernameStatus !== "invalid" && (
                    <p className={`text-sm mt-1.5 font-medium ${usernameStatus === "available" ? "text-emerald-600" : usernameStatus === "taken" ? "text-orange-600" : "text-gray-600"
                        }`}>
                        {usernameMessage}
                    </p>
                )}
                {errors.username && <p className="text-red-600 text-sm mt-1.5 font-medium">{errors.username}</p>}
                <p className="text-xs text-gray-500 mt-2">
                    💡 3-20 characters • Letters, numbers, hyphens, underscores
                </p>
            </div>

            {/* Bio Field */}
            <div>
                <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-2">
                    ✍️ Bio
                </label>
                <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself... What stories do you love?"
                    rows={4}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${errors.bio
                        ? "border-red-500 focus:ring-red-500 bg-red-50/30"
                        : "border-purple-200 focus:ring-purple-500 focus:border-purple-500 bg-purple-50/30 hover:border-purple-300 text-black"
                        }`}
                    disabled={isLoading}
                    maxLength={200}
                />
                <div className="flex justify-between items-center mt-1.5">
                    {errors.bio && <p className="text-red-600 text-sm font-medium">{errors.bio}</p>}
                    <p className={`text-xs ml-auto ${bio.length > 180 ? "text-amber-600 font-semibold" : "text-gray-500"}`}>
                        {bio.length}/200
                    </p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    💡 10-200 characters • Share your reading interests
                </p>
            </div>

            {/* Submit Error */}
            {errors.submit && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                    <p className="text-red-700 text-sm font-medium">❌ {errors.submit}</p>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-purple-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 disabled:from-purple-400 disabled:to-amber-400 text-white font-bold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
                {isLoading ? "✨ Creating Profile..." : "✨ Complete Profile"}
            </button>
        </form>
    );
}

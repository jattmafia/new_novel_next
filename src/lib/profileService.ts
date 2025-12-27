/**
 * Profile Service
 * Handles all API calls related to user profile management
 */

export interface UserProfile {
    _id: string;
    name: string;
    email: string;
    gender: "male" | "female" | "other";
    dob: string;
    profile: {
        username?: string;
        bio?: string;
        profilePicture?: string;
        location?: string;
        reputation: number;
        isVerified: boolean;
        subscriptionStatus: "none" | "active" | "expired";
        subscriptionEndDate?: string;
    };
    isEmailVerified: boolean;
    emailVerificationToken?: string;
    emailVerificationTokenExpiry?: string;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateProfilePayload {
    name?: string;
    username?: string;
    gender?: "male" | "female" | "other";
    dob?: string;
    bio?: string;
    location?: string;
    profilePicture?: File;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * Fetch current user's profile
 */
export async function getMyProfile(): Promise<UserProfile> {
    const token = localStorage.getItem("authToken");
    console.log("[getMyProfile] Token exists:", !!token);
    
    if (!token) {
        throw new Error("No auth token found");
    }

    const url = `${API_BASE}/profile/me`;
    console.log("[getMyProfile] Fetching from:", url);
    console.log("[getMyProfile] API_BASE:", API_BASE);
    console.log("[getMyProfile] Token (first 20 chars):", token.substring(0, 20) + "...");

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log("[getMyProfile] Response status:", response.status);
        console.log("[getMyProfile] Response ok:", response.ok);

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            console.error("[getMyProfile] Error response:", error);
            throw new Error(error.message || `Failed to fetch profile (${response.status})`);
        }

        const data = await response.json();
        console.log("[getMyProfile] Success:", data);
        return data;
    } catch (err) {
        console.error("[getMyProfile] Fetch error:", err);
        throw err;
    }
}

/**
 * Update user's profile
 */
export async function updateMyProfile(
    payload: UpdateProfilePayload
): Promise<UserProfile> {
    const token = localStorage.getItem("authToken");
    console.log("[updateMyProfile] Token exists:", !!token);
    
    if (!token) {
        throw new Error("No auth token found");
    }

    const url = `${API_BASE}/profile/update`;
    console.log("[updateMyProfile] Updating to:", url);

    const formData = new FormData();
    if (payload.name) formData.append("name", payload.name);
    if (payload.username) formData.append("username", payload.username);
    if (payload.gender) formData.append("gender", payload.gender);
    if (payload.dob) formData.append("dob", payload.dob);
    if (payload.bio) formData.append("bio", payload.bio);
    if (payload.location) formData.append("location", payload.location);
    if (payload.profilePicture) formData.append("profilePicture", payload.profilePicture);

    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                // Note: Content-Type is automatically set for FormData
            },
            body: formData,
        });

        console.log("[updateMyProfile] Response status:", response.status);
        console.log("[updateMyProfile] Response ok:", response.ok);

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            console.error("[updateMyProfile] Error response:", error);
            throw new Error(error.message || `Failed to update profile (${response.status})`);
        }

        const data = await response.json();
        console.log("[updateMyProfile] Success:", data);
        return data;
    } catch (err) {
        console.error("[updateMyProfile] Fetch error:", err);
        throw err;
    }
}

/**
 * Upload profile picture
 */
export async function uploadProfilePicture(
    file: File
): Promise<{ url: string }> {
    const token = localStorage.getItem("authToken");
    if (!token) {
        throw new Error("No auth token found");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE}/api/profile/upload-picture`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to upload picture");
    }

    return response.json();
}

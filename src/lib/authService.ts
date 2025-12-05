/**
 * Authentication Service
 * Handles all API calls to the backend authentication endpoints
 * Follows best practices: centralized API calls, error handling, type safety
 */

interface SignupPayload {
    name: string;
    email: string;
    password: string;
    gender: string;
    dob: string;
}

interface LoginPayload {
    email: string;
    password: string;
}

interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
        userId: string;
        email: string;
        name: string;
        token?: string;
        isEmailVerified?: boolean;
        profile?: {
            username?: string;
            bio?: string;
            profilePicture?: string;
            location?: string;
            reputation?: number;
        };
    };
    error?: string;
}

// When running in the browser we call our local Next.js proxy routes (to avoid CORS).
// These proxy endpoints are implemented under `src/app/api/...` and forward
// requests to the real backend API. Server-side code can still use the full URL.
const API_BASE_URL = "http://209.74.81.116/api";

/**
 * Sign up user with backend API
 * POST /auth/signup
 */
export const signupUser = async (payload: SignupPayload): Promise<AuthResponse> => {
    try {
        const url = typeof window === "undefined" ? `${API_BASE_URL}/auth/signup` : `/api/auth/signup`;
        console.log("Signup URL:", url);
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        let data: any = {};
        try {
            data = await response.json();
        } catch (e) {
            data = {};
        }
        console.log("Signup response data:", data);

        if (!response.ok) {
            const errMsg = (data && (data.error || data.message)) || response.statusText || "Signup failed";
            throw new Error(errMsg);
        }

        // Normalize successful response: ensure `success` exists and is true unless backend set it to false
        if (data && typeof data === "object") {
            return { ...data, success: (data.success ?? true) } as AuthResponse;
        }

        return { success: true, message: response.statusText || "OK", data } as AuthResponse;
    } catch (error) {
        console.error("Signup error:", error);
        throw error;
    }
};

/**
 * Login user with backend API
 * POST /auth/login
 * Backend returns: { token, user: { _id, name, email, ... } }
 */
export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
    try {
        const url = typeof window === "undefined" ? `${API_BASE_URL}/auth/login` : `/api/auth/login`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        let data: any = {};
        try {
            data = await response.json();
        } catch (e) {
            data = {};
        }

        if (!response.ok) {
            const errMsg = (data && (data.error || data.message)) || response.statusText || "Login failed";
            throw new Error(errMsg);
        }

        // Normalize backend response format
        // Backend returns: { token, user: { _id, name, email, isEmailVerified, profile: { username, bio, ... }, ... } }
        // We transform to: { success: true, message: "Login successful", data: { token, userId, email, name, isEmailVerified, profile } }
        if (data && typeof data === "object") {
            const normalizedData: AuthResponse = {
                success: true,
                message: "Login successful",
                data: {
                    userId: data.user?._id || "",
                    email: data.user?.email || "",
                    name: data.user?.name || "",
                    token: data.token || "",
                    isEmailVerified: data.user?.isEmailVerified ?? false,
                    profile: {
                        username: data.user?.profile?.username,
                        bio: data.user?.profile?.bio,
                        profilePicture: data.user?.profile?.profilePicture,
                        location: data.user?.profile?.location,
                        reputation: data.user?.profile?.reputation,
                    },
                },
            };
            return normalizedData;
        }

        return { success: true, message: response.statusText || "OK", data: {} } as AuthResponse;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

/**
 * Resend verification email
 * POST /auth/resend-verification
 */
export const resendVerification = async (email: string): Promise<{ message?: string; error?: string }> => {
    try {
        const url = typeof window === "undefined" ? `${API_BASE_URL}/auth/resend-verification` : `/api/auth/resend`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        let data: any = {};
        try {
            data = await response.json();
        } catch (e) {
            data = {};
        }

        if (!response.ok) {
            const errMsg = (data && (data.error || data.message)) || response.statusText || "Resend failed";
            throw new Error(errMsg);
        }

        return data;
    } catch (error) {
        console.error("Resend verification error:", error);
        throw error;
    }
};

/**
 * Create user profile
 * POST /profile/create
 */
export const createProfile = async (
    username: string,
    bio: string,
    profilePicture: File | null,
    token: string
): Promise<AuthResponse> => {
    try {
        const url = typeof window === "undefined" ? `${API_BASE_URL}/profile/update` : `/api/profile/update`;
        const formData = new FormData();
        formData.append("username", username);
        formData.append("bio", bio);
        if (profilePicture) {
            formData.append("profilePicture", profilePicture);
        }

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: formData,
        });

        let data: any = {};
        try {
            data = await response.json();
        } catch (e) {
            data = {};
        }

        if (!response.ok) {
            const errMsg = (data && (data.error || data.message)) || response.statusText || "Profile creation failed";
            throw new Error(errMsg);
        }

        if (data && typeof data === "object") {
            return { ...data, success: (data.success ?? true) } as AuthResponse;
        }

        return { success: true, message: response.statusText || "OK", data } as AuthResponse;
    } catch (error) {
        console.error("Profile creation error:", error);
        throw error;
    }
};

/**
 * Check if username is available
 * GET /profile/check-username?username=...
 */
export const checkUsernameAvailability = async (username: string): Promise<{ available: boolean; message?: string; error?: string }> => {
    try {
        const url = typeof window === "undefined"
            ? `${API_BASE_URL}/profile/check-username?username=${encodeURIComponent(username)}`
            : `/api/profile/check-username?username=${encodeURIComponent(username)}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        let data: any = {};
        try {
            data = await response.json();
        } catch (e) {
            data = {};
        }

        if (!response.ok) {
            const errMsg = (data && (data.error || data.message)) || response.statusText || "Username check failed";
            throw new Error(errMsg);
        }

        // Backend returns: { username, available: boolean, message } or { error }
        return {
            available: data.available ?? false,
            message: data.message,
            error: data.error,
        };
    } catch (error) {
        console.error("Username check error:", error);
        throw error;
    }
};

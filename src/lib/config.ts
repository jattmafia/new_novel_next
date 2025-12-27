// Global API configuration
// Default to local API during development; override with NEXT_PUBLIC_API_URL in environment.
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Public image base (R2) - used to build full URLs for stored images.
// Default points to the provided dev R2 URL; override with NEXT_PUBLIC_IMAGE_BASE in env.
export const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE || 'https://pub-64c8e98de340487ca31162c0a1ae0a24.r2.dev';

export function imageUrl(pathOrUrl?: string | null) {
    if (!pathOrUrl) return pathOrUrl || null;
    const trimmed = String(pathOrUrl).trim();
    if (!trimmed) return null;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    // Ensure no double slashes
    return `${IMAGE_BASE.replace(/\/$/, '')}/${trimmed.replace(/^\//, '')}`;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        // Allow R2 / Cloudflare storage hostnames used by the backend for cover/profile images.
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'pub-64c8e98de340487ca31162c0a1ae0a24.r2.dev',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '**.r2.cloudflarestorage.com',
                pathname: '/**',
            },
        ],
        // Disable the built-in image optimizer. This serves external images directly
        // which avoids failures from the optimizer during development (useful for R2).
        unoptimized: true,
    },
};

module.exports = nextConfig;

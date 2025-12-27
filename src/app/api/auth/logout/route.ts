import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
        
        // Clear the authToken cookie
        response.cookies.set('authToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0, // This deletes the cookie
            path: '/',
        });

        return response;
    } catch (err: any) {
        console.error('Logout error:', err);
        return NextResponse.json({ success: false, message: 'Logout failed' }, { status: 500 });
    }
}

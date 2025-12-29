import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Mock Validation
    if (email === 'demo@example.com' && password === 'password') {
      // Create response
      const response = NextResponse.json({ success: true });
      
      // Set HttpOnly Cookie
      response.cookies.set('auth_token', 'mock-jwt-token-123456', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' }, 
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' }, 
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { password } = body;

    // Delete account in your backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${session.user.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.message || 'Failed to delete account' }, { status: response.status });
    }

    return NextResponse.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
} 
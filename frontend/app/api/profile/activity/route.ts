import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch activity history from your backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${session.user.id}/activity`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.message || 'Failed to fetch activity history' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching activity history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity history' },
      { status: 500 }
    );
  }
} 
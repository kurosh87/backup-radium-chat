import { auth } from '@clerk/nextjs/server';
import { type NextRequest, NextResponse } from 'next/server';
import { getChatsByUserId } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const limit = Number.parseInt(searchParams.get('limit') || '10');
  const startingAfter = searchParams.get('starting_after');
  const endingBefore = searchParams.get('ending_before');

  if (startingAfter && endingBefore) {
    return new Response(
      'Only one of starting_after or ending_before can be provided!',
      { status: 400 },
    );
  }

  const authResult = await auth();

  if (!authResult?.userId) {
    return new Response('Unauthorized!', { status: 401 });
  }
  const userId = authResult.userId;

  try {
    const chats = await getChatsByUserId({
      id: userId,
      limit,
      startingAfter: startingAfter ? String(startingAfter) : null,
      endingBefore: endingBefore ? String(endingBefore) : null,
    });

    return NextResponse.json(chats);
  } catch (err) {
    console.error('/api/history error. Original error:', err);
    return new Response('Failed to fetch chats!', {
      status: 500,
    });
  }
}

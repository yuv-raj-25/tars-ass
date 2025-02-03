import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Note from '@/lib/models/notes.models';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Session } from 'next-auth'
import { FilterQuery } from 'mongoose';
import mongoose from 'mongoose';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions) as Session & {
      user: {
        id: string;
        email: string;
      }
    };
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const sortOrder = searchParams.get('sort') || 'desc';

    await connectToDatabase();

    let query: FilterQuery<typeof Note> = { userId: session.user.id };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const notes = await Note.find(query)
      .sort({ createdAt: sortOrder === 'asc' ? 1 : -1 })
      .exec();

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions) as Session & {
      user: {
        id: string;
        email: string;
      }
    };
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, isAudio } = await req.json();

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const note = await Note.create({
      userId: session.user.id,
      title: title.trim(),
      content: content.trim(),
      isAudio: Boolean(isAudio)
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: 'Error creating note' },
      { status: 500 }
    );
  }
}

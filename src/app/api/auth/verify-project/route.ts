import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { projectId, password } = body;

    if (!projectId || !password) {
      return NextResponse.json(
        { error: 'Project ID and password are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('projects')
      .select('id, name, password')
      .eq('id', projectId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    if (data.password === password) {
      return NextResponse.json({
        success: true,
        project: {
          id: data.id,
          name: data.name,
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

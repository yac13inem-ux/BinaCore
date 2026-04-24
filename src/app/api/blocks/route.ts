import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// GET - Fetch all blocks
export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured in GET /api/blocks');
      return NextResponse.json([], { status: 200 });
    }

    const { data, error } = await supabase
      .from('blocks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error in GET /api/blocks:', error);
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error in GET /api/blocks:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST - Create a new block
export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();

    const { data, error } = await supabase
      .from('blocks')
      .insert([{
        project_id: body.projectId,
        block_number: body.blockNumber,
        block_name: body.blockName,
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error in POST /api/blocks:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/blocks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

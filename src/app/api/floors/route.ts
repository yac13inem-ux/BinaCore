import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// GET - Fetch all floors
export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured in GET /api/floors');
      return NextResponse.json([], { status: 200 });
    }

    const { data, error } = await supabase
      .from('floors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error in GET /api/floors:', error);
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error in GET /api/floors:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST - Create a new floor
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
      .from('floors')
      .insert([{
        project_id: body.projectId,
        block_id: body.blockId,
        floor_number: body.floorNumber,
        floor_name: body.floorName,
        ces: body.ces || null,
        cet: body.cet || null,
        coulage_date: body.coulageDate || null,
        coulage_time: body.coulageTime || null,
        verification_date: body.verificationDate || null,
        verification_time: body.verificationTime || null,
        status: body.status || 'notStarted',
        notes: body.notes || null,
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error in POST /api/floors:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/floors:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

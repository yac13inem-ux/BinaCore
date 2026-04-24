import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// GET - Fetch all reports
export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured in GET /api/reports');
      return NextResponse.json([], { status: 200 });
    }

    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error in GET /api/reports:', error);
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error in GET /api/reports:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST - Create a new report
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
      .from('reports')
      .insert([{
        project_id: body.projectId,
        type: body.type,
        date: body.date,
        description: body.description,
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error in POST /api/reports:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/reports:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

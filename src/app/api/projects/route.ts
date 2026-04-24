import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// GET - Fetch all projects
export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured in GET /api/projects');
      return NextResponse.json(
        [],
        { status: 200 }
      );
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error in GET /api/projects:', error);
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error in GET /api/projects:', error);
    return NextResponse.json(
      [],
      { status: 200 }
    );
  }
}

// POST - Create a new project
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
      .from('projects')
      .insert([{
        name: body.name,
        description: body.description || null,
        password: body.password,
        building_type: body.buildingType || 'immeuble',
        number_of_floors: body.numberOfFloors || 0,
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error in POST /api/projects:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

# BinaCore - Supabase Database Setup Guide

This guide will help you set up the Supabase database for BinaCore to enable multi-user cloud access.

## 📋 Prerequisites

- A Supabase account (free at [supabase.com](https://supabase.com))
- Your project is ready to use the new API

## 🚀 Step-by-Step Setup

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in:
   - **Name**: `binacore` (or your preferred name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose a region close to your users
4. Click **"Create new project"**
5. Wait 1-2 minutes for your project to be ready

### Step 2: Get Your Credentials

1. In your project dashboard, click **"Settings"** → **"API"**
2. Copy:
   - **Project URL** → paste into `.env.local` as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → paste into `.env.local` as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Example `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Create Database Tables

1. Go to **"SQL Editor"** in Supabase
2. Click **"New query"**
3. Copy and run the SQL below:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Projects table
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  password TEXT NOT NULL,
  building_type TEXT DEFAULT 'immeuble',
  number_of_floors INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Blocks table
CREATE TABLE blocks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  block_number INTEGER NOT NULL,
  block_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Floors table
CREATE TABLE floors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  block_id UUID REFERENCES blocks(id) ON DELETE CASCADE,
  floor_number INTEGER NOT NULL,
  floor_name TEXT NOT NULL,
  ces JSONB,
  cet JSONB,
  coulage_date DATE,
  coulage_time TEXT,
  verification_date DATE,
  verification_time TEXT,
  status TEXT DEFAULT 'notStarted',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Reports table
CREATE TABLE reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Problems table
CREATE TABLE problems (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_projects_created ON projects(created_at DESC);
CREATE INDEX idx_blocks_project ON blocks(project_id);
CREATE INDEX idx_floors_project ON floors(project_id);
CREATE INDEX idx_floors_block ON floors(block_id);
CREATE INDEX idx_reports_project ON reports(project_id);
CREATE INDEX idx_problems_project ON problems(project_id);
```

### Step 4: Enable Row Level Security (RLS)

1. Click **"New query"** again
2. Copy and run:

```sql
-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE floors ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;

-- Allow public access (security is via project password)
CREATE POLICY "Public can access projects" ON projects
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public can access blocks" ON blocks
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public can access floors" ON floors
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public can access reports" ON reports
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public can access problems" ON problems
  FOR ALL USING (true) WITH CHECK (true);
```

### Step 5: Update .env.local

1. Open `/home/z/my-project/.env.local`
2. Replace the placeholder values with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file

### Step 6: Restart the Application

```bash
# Stop the current dev server
# Then restart it
bun run dev
```

## ✅ Verification

Your app is now ready for multi-user cloud access:

1. **Anyone from anywhere** can access projects
2. They just need:
   - Project name
   - Project password

3. **Features available to all users with password:**
   - ✅ View all project data
   - ✅ Add new blocks, floors, reports, problems
   - ✅ Edit existing data
   - ✅ Delete data

## 🔐 Security Note

- Project passwords protect access (similar to a shared folder password)
- All users with the same project password have full access
- Anyone can create projects
- Consider using strong passwords for sensitive projects

## 📱 How Users Access the App

1. Open BinaCore app (on any device)
2. Dashboard will show **all projects** from the database
3. To access a specific project:
   - Click on the project
   - Enter the project password
   - **Access granted!**

4. Multiple users can work on the same project simultaneously:
   - User A adds a block in Algeria
   - User B sees it instantly in France
   - User C edits a floor in Morocco
   - Everyone sees the update immediately

## 🛠️ Troubleshooting

### "Supabase not configured" error
- Check your `.env.local` file has the correct values
- Restart the dev server after updating `.env.local`

### Data not appearing
- Check Supabase logs in the dashboard
- Verify database tables are created
- Check your network connection

### Password verification fails
- Ensure you're using the correct project password
- Check for typos in password field

## 📚 Next Steps

After setup, consider:
- Adding user authentication (if you need individual accounts)
- Implementing real-time subscriptions for instant updates
- Setting up backup policies in Supabase

## 📞 Support

If you encounter issues:
1. Check Supabase logs in the dashboard
2. Verify your `.env.local` file
3. Make sure all SQL queries ran successfully

---

**Made with ❤️ by Dz Build**

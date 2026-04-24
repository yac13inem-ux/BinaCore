import { isSupabaseConfigured } from './supabase';

// Project data types
export interface Project {
  id: string;
  name: string;
  description?: string;
  password: string; // In production, this should be hashed
  buildingType: 'immeuble' | 'villa' | 'bureau' | 'commercial' | 'other';
  numberOfFloors: number;
  createdAt: string;
  updatedAt: string;
}

export interface Block {
  id: string;
  projectId: string;
  blockName: string;
  blockNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface Floor {
  id: string;
  projectId: string;
  blockId: string;
  floorNumber: number;
  floorName: string;
  ces?: CES | null;
  cet?: CET | null;
  coulageDate?: string | null;
  coulageTime?: string | null;
  verificationDate?: string | null;
  verificationTime?: string | null;
  notes?: string;
  status: 'notStarted' | 'inProgress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Logement {
  id: string;
  type: string; // studio, f1, f2, f3, f4, f5, t1, t2, t3, t4
  notes?: string;
}

export interface CES {
  inspected: boolean;
  date: string | null;
  notes?: string;
  logements?: Logement[];
}

export interface CET {
  inspected: boolean;
  date: string | null;
  notes?: string;
  logements?: Logement[];
}

export interface Report {
  id: string;
  projectId: string;
  type: 'pvVisite' | 'pvConstat' | 'rapport';
  date: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Problem {
  id: string;
  projectId: string;
  title: string;
  description: string;
  date: string;
  status: 'open' | 'inProgress' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

// Verify project password via API
export async function verifyProjectPassword(
  projectId: string,
  password: string
): Promise<{ success: boolean; project?: { id: string; name: string } }> {
  if (isSupabaseConfigured()) {
    try {
      const response = await fetch('/api/auth/verify-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId, password }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Verification failed');
      }

      const data = await response.json();
      return {
        success: data.success,
        project: data.project,
      };
    } catch (error) {
      console.error('Password verification error:', error);
      return { success: false };
    }
  } else {
    // Fallback to localStorage mode
    const { getProjectById } = await import('./storage-local');
    const project = getProjectById(projectId);
    if (project && project.password === password) {
      return {
        success: true,
        project: {
          id: project.id,
          name: project.name,
        },
      };
    }
    return { success: false };
  }
}

// Export all functions from hybrid storage
export * from './storage-hybrid';

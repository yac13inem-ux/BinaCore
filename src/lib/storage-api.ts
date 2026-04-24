import { isSupabaseConfigured } from './supabase';
import type {
  Project,
  Block,
  Floor,
  Report,
  Problem,
} from './storage';

// Generic API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// ========== PROJECTS ==========

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }

  const data = await apiRequest<Project[]>('/api/projects');

  // Transform Supabase format to app format
  return data.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    password: p.password,
    buildingType: p.building_type || 'immeuble',
    numberOfFloors: p.number_of_floors || 0,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  }));
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const data = await apiRequest<Project>(`/api/projects/${id}`);
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      password: data.password,
      buildingType: data.building_type || 'immeuble',
      numberOfFloors: data.number_of_floors || 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch {
    return null;
  }
}

export async function createProject(data: {
  name: string;
  description?: string;
  password: string;
  buildingType?: string;
  numberOfFloors?: number;
}): Promise<Project> {
  const response = await apiRequest<Project>('/api/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return {
    id: response.id,
    name: response.name,
    description: response.description,
    password: response.password,
    buildingType: response.building_type || 'immeuble',
    numberOfFloors: response.number_of_floors || 0,
    createdAt: response.created_at,
    updatedAt: response.updated_at,
  };
}

export async function updateProject(
  id: string,
  data: Partial<Project>
): Promise<Project> {
  const response = await apiRequest<Project>(`/api/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  return {
    id: response.id,
    name: response.name,
    description: response.description,
    password: response.password,
    buildingType: response.building_type || 'immeuble',
    numberOfFloors: response.number_of_floors || 0,
    createdAt: response.created_at,
    updatedAt: response.updated_at,
  };
}

export async function deleteProject(id: string): Promise<void> {
  await apiRequest(`/api/projects/${id}`, {
    method: 'DELETE',
  });
}

// ========== BLOCKS ==========

export async function getBlocks(): Promise<Block[]> {
  const data = await apiRequest<Block[]>('/api/blocks');

  return data.map(b => ({
    id: b.id,
    projectId: b.project_id,
    blockName: b.block_name,
    blockNumber: b.block_number,
    createdAt: b.created_at,
    updatedAt: b.updated_at,
  }));
}

export async function getBlocksByProject(projectId: string): Promise<Block[]> {
  const blocks = await getBlocks();
  return blocks.filter(b => b.projectId === projectId);
}

export async function getBlockById(id: string): Promise<Block | null> {
  try {
    const data = await apiRequest<Block>(`/api/blocks/${id}`);
    return {
      id: data.id,
      projectId: data.project_id,
      blockName: data.block_name,
      blockNumber: data.block_number,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch {
    return null;
  }
}

export async function createBlock(data: {
  projectId: string;
  blockNumber: number;
  blockName: string;
}): Promise<Block> {
  const response = await apiRequest<Block>('/api/blocks', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return {
    id: response.id,
    projectId: response.project_id,
    blockName: response.block_name,
    blockNumber: response.block_number,
    createdAt: response.created_at,
    updatedAt: response.updated_at,
  };
}

export async function updateBlock(
  id: string,
  data: Partial<Block>
): Promise<Block> {
  const response = await apiRequest<Block>(`/api/blocks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  return {
    id: response.id,
    projectId: response.project_id,
    blockName: response.block_name,
    blockNumber: response.block_number,
    createdAt: response.created_at,
    updatedAt: response.updated_at,
  };
}

export async function deleteBlock(id: string): Promise<void> {
  await apiRequest(`/api/blocks/${id}`, {
    method: 'DELETE',
  });
}

// ========== FLOORS ==========

export async function getFloors(): Promise<Floor[]> {
  const data = await apiRequest<Floor[]>('/api/floors');

  return data.map(f => ({
    id: f.id,
    projectId: f.project_id,
    blockId: f.block_id,
    floorNumber: f.floor_number,
    floorName: f.floor_name,
    ces: f.ces,
    cet: f.cet,
    coulageDate: f.coulage_date,
    coulageTime: f.coulage_time,
    verificationDate: f.verification_date,
    verificationTime: f.verification_time,
    status: f.status || 'notStarted',
    notes: f.notes,
    createdAt: f.created_at,
    updatedAt: f.updated_at,
  }));
}

export async function getFloorsByProject(projectId: string): Promise<Floor[]> {
  const floors = await getFloors();
  return floors.filter(f => f.projectId === projectId);
}

export async function getFloorsByBlock(blockId: string): Promise<Floor[]> {
  const floors = await getFloors();
  return floors.filter(f => f.blockId === blockId);
}

export async function getFloorById(id: string): Promise<Floor | null> {
  try {
    const data = await apiRequest<Floor>(`/api/floors/${id}`);
    return {
      id: data.id,
      projectId: data.project_id,
      blockId: data.block_id,
      floorNumber: data.floor_number,
      floorName: data.floor_name,
      ces: data.ces,
      cet: data.cet,
      coulageDate: data.coulage_date,
      coulageTime: data.coulage_time,
      verificationDate: data.verification_date,
      verificationTime: data.verification_time,
      status: data.status || 'notStarted',
      notes: data.notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch {
    return null;
  }
}

export async function createFloor(data: Partial<Floor>): Promise<Floor> {
  const response = await apiRequest<Floor>('/api/floors', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return {
    id: response.id,
    projectId: response.project_id,
    blockId: response.block_id,
    floorNumber: response.floor_number,
    floorName: response.floor_name,
    ces: response.ces,
    cet: response.cet,
    coulageDate: response.coulage_date,
    coulageTime: response.coulage_time,
    verificationDate: response.verification_date,
    verificationTime: response.verification_time,
    status: response.status || 'notStarted',
    notes: response.notes,
    createdAt: response.created_at,
    updatedAt: response.updated_at,
  };
}

export async function updateFloor(
  id: string,
  data: Partial<Floor>
): Promise<Floor> {
  const response = await apiRequest<Floor>(`/api/floors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  return {
    id: response.id,
    projectId: response.project_id,
    blockId: response.block_id,
    floorNumber: response.floor_number,
    floorName: response.floor_name,
    ces: response.ces,
    cet: response.cet,
    coulageDate: response.coulage_date,
    coulageTime: response.coulage_time,
    verificationDate: response.verification_date,
    verificationTime: response.verification_time,
    status: response.status || 'notStarted',
    notes: response.notes,
    createdAt: response.created_at,
    updatedAt: response.updated_at,
  };
}

export async function deleteFloor(id: string): Promise<void> {
  await apiRequest(`/api/floors/${id}`, {
    method: 'DELETE',
  });
}

// ========== REPORTS ==========

export async function getReports(): Promise<Report[]> {
  const data = await apiRequest<Report[]>('/api/reports');

  return data.map(r => ({
    id: r.id,
    projectId: r.project_id,
    type: r.type,
    date: r.date,
    description: r.description,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
}

export async function getReportsByProject(projectId: string): Promise<Report[]> {
  const reports = await getReports();
  return reports.filter(r => r.projectId === projectId);
}

export async function getReportById(id: string): Promise<Report | null> {
  try {
    const data = await apiRequest<Report>(`/api/reports/${id}`);
    return {
      id: data.id,
      projectId: data.project_id,
      type: data.type,
      date: data.date,
      description: data.description,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch {
    return null;
  }
}

export async function createReport(data: Partial<Report>): Promise<Report> {
  const response = await apiRequest<Report>('/api/reports', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return {
    id: response.id,
    projectId: response.project_id,
    type: response.type,
    date: response.date,
    description: response.description,
    createdAt: response.created_at,
    updatedAt: response.updated_at,
  };
}

export async function updateReport(
  id: string,
  data: Partial<Report>
): Promise<Report> {
  const response = await apiRequest<Report>(`/api/reports/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  return {
    id: response.id,
    projectId: response.project_id,
    type: response.type,
    date: response.date,
    description: response.description,
    createdAt: response.created_at,
    updatedAt: response.updated_at,
  };
}

export async function deleteReport(id: string): Promise<void> {
  await apiRequest(`/api/reports/${id}`, {
    method: 'DELETE',
  });
}

// ========== PROBLEMS ==========

export async function getProblems(): Promise<Problem[]> {
  const data = await apiRequest<Problem[]>('/api/problems');

  return data.map(p => ({
    id: p.id,
    projectId: p.project_id,
    title: p.title,
    description: p.description,
    date: p.date,
    status: p.status || 'open',
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  }));
}

export async function getProblemsByProject(projectId: string): Promise<Problem[]> {
  const problems = await getProblems();
  return problems.filter(p => p.projectId === projectId);
}

export async function getProblemsByStatus(
  status: Problem['status']
): Promise<Problem[]> {
  const problems = await getProblems();
  return problems.filter(p => p.status === status);
}

export async function getProblemById(id: string): Promise<Problem | null> {
  try {
    const data = await apiRequest<Problem>(`/api/problems/${id}`);
    return {
      id: data.id,
      projectId: data.project_id,
      title: data.title,
      description: data.description,
      date: data.date,
      status: data.status || 'open',
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch {
    return null;
  }
}

export async function createProblem(data: Partial<Problem>): Promise<Problem> {
  const response = await apiRequest<Problem>('/api/problems', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return {
    id: response.id,
    projectId: response.project_id,
    title: response.title,
    description: response.description,
    date: response.date,
    status: response.status || 'open',
    createdAt: response.created_at,
    updatedAt: response.updated_at,
  };
}

export async function updateProblem(
  id: string,
  data: Partial<Problem>
): Promise<Problem> {
  const response = await apiRequest<Problem>(`/api/problems/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  return {
    id: response.id,
    projectId: response.project_id,
    title: response.title,
    description: response.description,
    date: response.date,
    status: response.status || 'open',
    createdAt: response.created_at,
    updatedAt: response.updated_at,
  };
}

export async function deleteProblem(id: string): Promise<void> {
  await apiRequest(`/api/problems/${id}`, {
    method: 'DELETE',
  });
}

// ========== UTILITY FUNCTIONS ==========

export async function getProjectProgress(project: Project): Promise<number> {
  const blocks = await getBlocksByProject(project.id);
  const reports = await getReportsByProject(project.id);
  const problems = await getProblemsByProject(project.id);

  const allFloors = await Promise.all(
    blocks.map(b => getFloorsByBlock(b.id))
  );
  const floors = allFloors.flat();

  let completedTasks = 0;
  let totalTasks = 0;

  // Check if blocks exist
  totalTasks += 1;
  if (blocks.length > 0) completedTasks++;

  // Check floor completion
  totalTasks += floors.length;
  completedTasks += floors.filter(f => f.status === 'completed').length;

  // Check problems resolution
  totalTasks += problems.length;
  completedTasks += problems.filter(p => p.status === 'resolved').length;

  // Check reports
  totalTasks += reports.length * 3;
  completedTasks += reports.length;

  return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
}

export function getBlockName(blockId: string): string {
  // This function needs to be async in API mode
  // For now, return a placeholder
  return 'Loading...';
}

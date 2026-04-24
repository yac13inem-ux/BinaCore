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

// Storage keys
const PROJECTS_KEY = 'binacore_projects';
const BLOCKS_KEY = 'binacore_blocks';
const FLOORS_KEY = 'binacore_floors';
const REPORTS_KEY = 'binacore_reports';
const PROBLEMS_KEY = 'binacore_problems';

// Generic storage utilities
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
  }
}

// Projects
export function getProjects(): Project[] {
  return getFromStorage<Project[]>(PROJECTS_KEY, []);
}

export function getProjectById(id: string): Project | undefined {
  const projects = getProjects();
  return projects.find(p => p.id === id);
}

export function saveProject(project: Project): void {
  const projects = getProjects();
  const existingIndex = projects.findIndex(p => p.id === project.id);
  
  if (existingIndex >= 0) {
    projects[existingIndex] = { ...project, updatedAt: new Date().toISOString() };
  } else {
    projects.push(project);
  }
  
  setToStorage(PROJECTS_KEY, projects);
}

export function deleteProject(id: string): void {
  const projects = getProjects().filter(p => p.id !== id);
  setToStorage(PROJECTS_KEY, projects);

  // Also delete associated blocks, floors, reports and problems
  const blocks = getBlocks().filter(b => b.projectId !== id);
  setToStorage(BLOCKS_KEY, blocks);

  const floors = getFloors().filter(f => f.projectId !== id);
  setToStorage(FLOORS_KEY, floors);

  const reports = getReports().filter(r => r.projectId !== id);
  setToStorage(REPORTS_KEY, reports);

  const problems = getProblems().filter(p => p.projectId !== id);
  setToStorage(PROBLEMS_KEY, problems);
}

// Blocks
export function getBlocks(): Block[] {
  return getFromStorage<Block[]>(BLOCKS_KEY, []);
}

export function getBlocksByProject(projectId: string): Block[] {
  return getBlocks().filter(b => b.projectId === projectId);
}

export function getBlockById(id: string): Block | undefined {
  const blocks = getBlocks();
  return blocks.find(b => b.id === id);
}

export function saveBlock(block: Block): void {
  const blocks = getBlocks();
  const existingIndex = blocks.findIndex(b => b.id === block.id);

  if (existingIndex >= 0) {
    blocks[existingIndex] = { ...block, updatedAt: new Date().toISOString() };
  } else {
    blocks.push(block);
  }

  setToStorage(BLOCKS_KEY, blocks);
}

export function deleteBlock(id: string): void {
  const blocks = getBlocks().filter(b => b.id !== id);
  setToStorage(BLOCKS_KEY, blocks);

  // Also delete associated floors
  const floors = getFloors().filter(f => f.blockId !== id);
  setToStorage(FLOORS_KEY, floors);
}

export function createBlock(data: Omit<Block, 'id' | 'createdAt' | 'updatedAt'>): Block {
  const block: Block = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveBlock(block);
  return block;
}

export function updateBlock(id: string, data: Partial<Block>): Block | null {
  const blocks = getBlocks();
  const block = blocks.find(b => b.id === id);

  if (block) {
    const updated = { ...block, ...data, updatedAt: new Date().toISOString() };
    saveBlock(updated);
    return updated;
  }

  return null;
}

// Floors
export function getFloors(): Floor[] {
  return getFromStorage<Floor[]>(FLOORS_KEY, []);
}

export function getFloorsByProject(projectId: string): Floor[] {
  return getFloors().filter(f => f.projectId === projectId);
}

export function getFloorsByBlock(blockId: string): Floor[] {
  return getFloors().filter(f => f.blockId === blockId);
}

export function getFloorById(id: string): Floor | undefined {
  const floors = getFloors();
  return floors.find(f => f.id === id);
}

export function getBlockName(blockId: string): string {
  const block = getBlockById(blockId);
  return block ? `${block.blockNumber} - ${block.blockName}` : 'Unknown Block';
}

export function saveFloor(floor: Floor): void {
  const floors = getFloors();
  const existingIndex = floors.findIndex(f => f.id === floor.id);

  if (existingIndex >= 0) {
    floors[existingIndex] = { ...floor, updatedAt: new Date().toISOString() };
  } else {
    floors.push(floor);
  }

  setToStorage(FLOORS_KEY, floors);
}

export function deleteFloor(id: string): void {
  const floors = getFloors().filter(f => f.id !== id);
  setToStorage(FLOORS_KEY, floors);
}

export function createFloor(data: Omit<Floor, 'id' | 'createdAt' | 'updatedAt'>): Floor {
  const floor: Floor = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveFloor(floor);
  return floor;
}

export function updateFloor(id: string, data: Partial<Floor>): Floor | null {
  const floors = getFloors();
  const floor = floors.find(f => f.id === id);

  if (floor) {
    const updated = { ...floor, ...data, updatedAt: new Date().toISOString() };
    saveFloor(updated);
    return updated;
  }

  return null;
}

export function createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
  const project: Project = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveProject(project);
  return project;
}

export function updateProject(id: string, data: Partial<Project>): Project | null {
  const projects = getProjects();
  const project = projects.find(p => p.id === id);
  
  if (project) {
    const updated = { ...project, ...data, updatedAt: new Date().toISOString() };
    saveProject(updated);
    return updated;
  }
  
  return null;
}

// Reports
export function getReports(): Report[] {
  return getFromStorage<Report[]>(REPORTS_KEY, []);
}

export function getReportsByProject(projectId: string): Report[] {
  return getReports().filter(r => r.projectId === projectId);
}

export function getReportById(id: string): Report | undefined {
  const reports = getReports();
  return reports.find(r => r.id === id);
}

export function saveReport(report: Report): void {
  const reports = getReports();
  const existingIndex = reports.findIndex(r => r.id === report.id);
  
  if (existingIndex >= 0) {
    reports[existingIndex] = { ...report, updatedAt: new Date().toISOString() };
  } else {
    reports.push(report);
  }
  
  setToStorage(REPORTS_KEY, reports);
}

export function deleteReport(id: string): void {
  const reports = getReports().filter(r => r.id !== id);
  setToStorage(REPORTS_KEY, reports);
}

export function createReport(data: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>): Report {
  const report: Report = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveReport(report);
  return report;
}

export function updateReport(id: string, data: Partial<Report>): Report | null {
  const reports = getReports();
  const report = reports.find(r => r.id === id);
  
  if (report) {
    const updated = { ...report, ...data, updatedAt: new Date().toISOString() };
    saveReport(updated);
    return updated;
  }
  
  return null;
}

// Problems
export function getProblems(): Problem[] {
  return getFromStorage<Problem[]>(PROBLEMS_KEY, []);
}

export function getProblemsByProject(projectId: string): Problem[] {
  return getProblems().filter(p => p.projectId === projectId);
}

export function getProblemsByStatus(status: Problem['status']): Problem[] {
  return getProblems().filter(p => p.status === status);
}

export function getProblemById(id: string): Problem | undefined {
  const problems = getProblems();
  return problems.find(p => p.id === id);
}

export function saveProblem(problem: Problem): void {
  const problems = getProblems();
  const existingIndex = problems.findIndex(p => p.id === problem.id);
  
  if (existingIndex >= 0) {
    problems[existingIndex] = { ...problem, updatedAt: new Date().toISOString() };
  } else {
    problems.push(problem);
  }
  
  setToStorage(PROBLEMS_KEY, problems);
}

export function deleteProblem(id: string): void {
  const problems = getProblems().filter(p => p.id !== id);
  setToStorage(PROBLEMS_KEY, problems);
}

export function createProblem(data: Omit<Problem, 'id' | 'createdAt' | 'updatedAt'>): Problem {
  const problem: Problem = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveProblem(problem);
  return problem;
}

export function updateProblem(id: string, data: Partial<Problem>): Problem | null {
  const problems = getProblems();
  const problem = problems.find(p => p.id === id);
  
  if (problem) {
    const updated = { ...problem, ...data, updatedAt: new Date().toISOString() };
    saveProblem(updated);
    return updated;
  }
  
  return null;
}

// Utility functions
export function getProjectProgress(project: Project): number {
  const blocks = getBlocksByProject(project.id);
  const reports = getReportsByProject(project.id);
  const problems = getProblemsByProject(project.id);

  let completedTasks = 0;
  let totalTasks = 0;

  // Check if blocks exist
  totalTasks += 1;
  if (blocks.length > 0) completedTasks++;

  // Check floor completion
  const allFloors = blocks.flatMap(b => getFloorsByBlock(b.id));
  totalTasks += allFloors.length;
  completedTasks += allFloors.filter(f => f.status === 'completed').length;

  // Check problems resolution
  totalTasks += problems.length;
  completedTasks += problems.filter(p => p.status === 'resolved').length;

  // Check reports
  totalTasks += reports.length * 3; // Each report type is tracked
  completedTasks += reports.length;

  return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
}

export function formatDate(dateString: string | null, language: 'fr' | 'en'): string {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', options);
}

export function shareToWhatsApp(text: string): void {
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

export async function shareToSystem(text: string, title: string = 'Share'): Promise<void> {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  } else {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(text);
  }
}

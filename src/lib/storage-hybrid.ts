import { isSupabaseConfigured } from './supabase';
import * as localStorage from './storage-local';
import * as apiStorage from './storage-api';
import type {
  Project,
  Block,
  Floor,
  Report,
  Problem,
} from './storage';

// Check if we should use API or localStorage
function shouldUseAPI(): boolean {
  return isSupabaseConfigured();
}

// ========== PROJECTS ==========

export async function getProjects(): Promise<Project[]> {
  if (shouldUseAPI()) {
    return await apiStorage.getProjects();
  }
  return localStorage.getProjects();
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  if (shouldUseAPI()) {
    return await apiStorage.getProjectById(id) || undefined;
  }
  return localStorage.getProjectById(id);
}

export async function createProject(
  data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Project> {
  if (shouldUseAPI()) {
    return await apiStorage.createProject(data);
  }
  return localStorage.createProject(data);
}

export async function updateProject(
  id: string,
  data: Partial<Project>
): Promise<Project | null> {
  if (shouldUseAPI()) {
    return await apiStorage.updateProject(id, data);
  }
  return localStorage.updateProject(id, data);
}

export async function deleteProject(id: string): Promise<void> {
  if (shouldUseAPI()) {
    await apiStorage.deleteProject(id);
  } else {
    localStorage.deleteProject(id);
  }
}

// ========== BLOCKS ==========

export async function getBlocks(): Promise<Block[]> {
  if (shouldUseAPI()) {
    return await apiStorage.getBlocks();
  }
  return localStorage.getBlocks();
}

export async function getBlocksByProject(projectId: string): Promise<Block[]> {
  if (shouldUseAPI()) {
    return await apiStorage.getBlocksByProject(projectId);
  }
  return localStorage.getBlocksByProject(projectId);
}

export async function getBlockById(id: string): Promise<Block | undefined> {
  if (shouldUseAPI()) {
    return await apiStorage.getBlockById(id) || undefined;
  }
  return localStorage.getBlockById(id);
}

export async function createBlock(
  data: Omit<Block, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Block> {
  if (shouldUseAPI()) {
    return await apiStorage.createBlock(data);
  }
  return localStorage.createBlock(data);
}

export async function updateBlock(
  id: string,
  data: Partial<Block>
): Promise<Block | null> {
  if (shouldUseAPI()) {
    return await apiStorage.updateBlock(id, data);
  }
  return localStorage.updateBlock(id, data);
}

export async function deleteBlock(id: string): Promise<void> {
  if (shouldUseAPI()) {
    await apiStorage.deleteBlock(id);
  } else {
    localStorage.deleteBlock(id);
  }
}

// ========== FLOORS ==========

export async function getFloors(): Promise<Floor[]> {
  if (shouldUseAPI()) {
    return await apiStorage.getFloors();
  }
  return localStorage.getFloors();
}

export async function getFloorsByProject(projectId: string): Promise<Floor[]> {
  if (shouldUseAPI()) {
    return await apiStorage.getFloorsByProject(projectId);
  }
  return localStorage.getFloorsByProject(projectId);
}

export async function getFloorsByBlock(blockId: string): Promise<Floor[]> {
  if (shouldUseAPI()) {
    return await apiStorage.getFloorsByBlock(blockId);
  }
  return localStorage.getFloorsByBlock(blockId);
}

export async function getFloorById(id: string): Promise<Floor | undefined> {
  if (shouldUseAPI()) {
    return await apiStorage.getFloorById(id) || undefined;
  }
  return localStorage.getFloorById(id);
}

export async function createFloor(
  data: Omit<Floor, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Floor> {
  if (shouldUseAPI()) {
    return await apiStorage.createFloor(data);
  }
  return localStorage.createFloor(data);
}

export async function updateFloor(
  id: string,
  data: Partial<Floor>
): Promise<Floor | null> {
  if (shouldUseAPI()) {
    return await apiStorage.updateFloor(id, data);
  }
  return localStorage.updateFloor(id, data);
}

export async function deleteFloor(id: string): Promise<void> {
  if (shouldUseAPI()) {
    await apiStorage.deleteFloor(id);
  } else {
    localStorage.deleteFloor(id);
  }
}

// ========== REPORTS ==========

export async function getReports(): Promise<Report[]> {
  if (shouldUseAPI()) {
    return await apiStorage.getReports();
  }
  return localStorage.getReports();
}

export async function getReportsByProject(projectId: string): Promise<Report[]> {
  if (shouldUseAPI()) {
    return await apiStorage.getReportsByProject(projectId);
  }
  return localStorage.getReportsByProject(projectId);
}

export async function getReportById(id: string): Promise<Report | undefined> {
  if (shouldUseAPI()) {
    return await apiStorage.getReportById(id) || undefined;
  }
  return localStorage.getReportById(id);
}

export async function createReport(
  data: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Report> {
  if (shouldUseAPI()) {
    return await apiStorage.createReport(data);
  }
  return localStorage.createReport(data);
}

export async function updateReport(
  id: string,
  data: Partial<Report>
): Promise<Report | null> {
  if (shouldUseAPI()) {
    return await apiStorage.updateReport(id, data);
  }
  return localStorage.updateReport(id, data);
}

export async function deleteReport(id: string): Promise<void> {
  if (shouldUseAPI()) {
    await apiStorage.deleteReport(id);
  } else {
    localStorage.deleteReport(id);
  }
}

// ========== PROBLEMS ==========

export async function getProblems(): Promise<Problem[]> {
  if (shouldUseAPI()) {
    return await apiStorage.getProblems();
  }
  return localStorage.getProblems();
}

export async function getProblemsByProject(projectId: string): Promise<Problem[]> {
  if (shouldUseAPI()) {
    return await apiStorage.getProblemsByProject(projectId);
  }
  return localStorage.getProblemsByProject(projectId);
}

export async function getProblemsByStatus(
  status: Problem['status']
): Promise<Problem[]> {
  if (shouldUseAPI()) {
    return await apiStorage.getProblemsByStatus(status);
  }
  return localStorage.getProblemsByStatus(status);
}

export async function getProblemById(id: string): Promise<Problem | undefined> {
  if (shouldUseAPI()) {
    return await apiStorage.getProblemById(id) || undefined;
  }
  return localStorage.getProblemById(id);
}

export async function createProblem(
  data: Omit<Problem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Problem> {
  if (shouldUseAPI()) {
    return await apiStorage.createProblem(data);
  }
  return localStorage.createProblem(data);
}

export async function updateProblem(
  id: string,
  data: Partial<Problem>
): Promise<Problem | null> {
  if (shouldUseAPI()) {
    return await apiStorage.updateProblem(id, data);
  }
  return localStorage.updateProblem(id, data);
}

export async function deleteProblem(id: string): Promise<void> {
  if (shouldUseAPI()) {
    await apiStorage.deleteProblem(id);
  } else {
    localStorage.deleteProblem(id);
  }
}

// ========== UTILITY FUNCTIONS ==========

export async function getProjectProgress(project: Project): Promise<number> {
  if (shouldUseAPI()) {
    return await apiStorage.getProjectProgress(project);
  }
  return localStorage.getProjectProgress(project);
}

export function getBlockName(blockId: string): string {
  // For localStorage mode, keep synchronous
  return localStorage.getBlockName(blockId);
}

export async function getBlockNameAsync(blockId: string): Promise<string> {
  if (shouldUseAPI()) {
    const block = await apiStorage.getBlockById(blockId);
    return block ? `${block.blockNumber} - ${block.blockName}` : 'Unknown Block';
  }
  return localStorage.getBlockName(blockId);
}

export interface BinaCoreData {
  projects: Project[];
  blocks: Block[];
  floors: Floor[];
  reports: Report[];
  problems: Problem[];
}

export function formatDate(dateString: string, language: string): string {
  try {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : language === 'fr' ? 'fr-FR' : 'en-US', options);
  } catch {
    return dateString;
  }
}

export function shareToWhatsApp(text: string): void {
  if (typeof window !== 'undefined' && window.navigator) {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }
}

export function shareToSystem(text: string): void {
  if (typeof window !== 'undefined' && navigator.share) {
    navigator.share({
      text,
    }).catch(() => {
      // Fallback silently
    });
  }
}

export async function exportData(): Promise<BinaCoreData> {
  const [projects, blocks, floors, reports, problems] = await Promise.all([
    getProjects(),
    getBlocks(),
    getFloors(),
    getReports(),
    getProblems(),
  ]);

  return {
    projects,
    blocks,
    floors,
    reports,
    problems,
  };
}

export async function importData(data: BinaCoreData): Promise<{ success: boolean; imported: number; message?: string }> {
  try {
    if (shouldUseAPI()) {
      let imported = 0;
      for (const project of data.projects) {
        await apiStorage.createProject({
          name: project.name,
          description: project.description,
          password: project.password,
          buildingType: project.buildingType,
          numberOfFloors: project.numberOfFloors,
        });
        imported++;
      }
      // Note: Blocks, floors, reports, and problems are not imported in API mode
      // as they require the new project IDs from the API
      return { success: true, imported };
    }
    // For localStorage mode, we could implement full import but for now just import projects
    return { success: false, imported: 0, message: 'Import not supported in localStorage mode' };
  } catch (error) {
    return { success: false, imported: 0, message: error instanceof Error ? error.message : 'Import failed' };
  }
}

export async function downloadDataAsJson(): Promise<void> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('downloadDataAsJson can only be called in the browser');
  }

  const data = await exportData();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `binacore-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function readJsonFile(file: File): Promise<BinaCoreData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const data = JSON.parse(json) as BinaCoreData;
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export type { Project, Block, Floor, Report, Problem, Logement, CES, CET } from './storage';

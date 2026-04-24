'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from 'next-themes';
import {
  LayoutDashboard,
  Building2,
  FileText,
  AlertTriangle,
  Settings,
  Layers,
  Menu,
  Eye,
  Pencil,
  Trash2,
  Share2,
  Plus,
  Search,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  Moon,
  Sun,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import {
  Project,
  getProjects,
  createProject,
  updateProject,
  deleteProject as deleteProjectStorage,
  Block,
  getBlocks,
  getBlocksByProject,
  getBlockById,
  createBlock,
  updateBlock,
  deleteBlock as deleteBlockStorage,
  Floor,
  getFloors,
  getFloorsByBlock,
  createFloor,
  updateFloor,
  deleteFloor as deleteFloorStorage,
  Report,
  getReports,
  createReport,
  updateReport,
  deleteReport as deleteReportStorage,
  Problem,
  getProblems,
  createProblem,
  updateProblem,
  deleteProblem as deleteProblemStorage,
  getProjectProgress,
  formatDate,
  shareToWhatsApp,
  shareToSystem,
  CES,
  CET,
  Logement,
  getBlockName,
} from '@/lib/storage';

type TabValue = 'dashboard' | 'projects' | 'reports' | 'problems' | 'settings';

export default function BinaCoreApp() {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabValue>('dashboard');
  const [mounted, setMounted] = useState(false);

  // Data
  const [projects, setProjects] = useState<Project[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);

  // Dialog states
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [projectPasswordDialogOpen, setProjectPasswordDialogOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [floorDialogOpen, setFloorDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [problemDialogOpen, setProblemDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form states
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [editingFloor, setEditingFloor] = useState<Floor | null>(null);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [selectedProjectForView, setSelectedProjectForView] = useState<Project | null>(null);
  const [selectedProjectForBlocks, setSelectedProjectForBlocks] = useState<Project | null>(null);
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set());
  const [selectedBlockProjectId, setSelectedBlockProjectId] = useState<string>('');
  const [projectPassword, setProjectPassword] = useState('');
  const [deletingItem, setDeletingItem] = useState<{
    type: 'project' | 'block' | 'floor' | 'report' | 'problem';
    id: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Project form
  const [projectForm, setProjectForm] = useState<{
    name: string;
    description: string;
    password: string;
  }>({
    name: '',
    description: '',
    password: '',
  });

  // Block form
  const [blockForm, setBlockForm] = useState<{
    projectId: string;
    blockNumber: string;
    blockName: string;
  }>({
    projectId: '',
    blockNumber: '',
    blockName: '',
  });

  // Report form
  const [reportForm, setReportForm] = useState<{
    projectId: string;
    type: 'pvVisite' | 'pvConstat' | 'rapport';
    date: string;
    description: string;
  }>({
    projectId: '',
    type: 'pvVisite',
    date: '',
    description: '',
  });

  // Problem form
  const [problemForm, setProblemForm] = useState<{
    projectId: string;
    title: string;
    description: string;
    date: string;
    status: 'open' | 'inProgress' | 'resolved';
  }>({
    projectId: '',
    title: '',
    description: '',
    date: '',
    status: 'open',
  });

  // Floor form
  const [floorForm, setFloorForm] = useState<{
    projectId: string;
    blockId: string;
    floorNumber: string;
    floorName: string;
    ces: CES;
    cet: CET;
    coulageDate: string;
    coulageTime: string;
    verificationDate: string;
    verificationTime: string;
    status: 'notStarted' | 'inProgress' | 'completed';
    notes: string;
  }>({
    projectId: '',
    blockId: '',
    floorNumber: '',
    floorName: '',
    ces: { inspected: false, date: '', notes: '' } as CES,
    cet: { inspected: false, date: '', notes: '' } as CET,
    coulageDate: '',
    coulageTime: '',
    verificationDate: '',
    verificationTime: '',
    status: 'notStarted',
    notes: '',
  });

  const loadData = () => {
    setProjects(getProjects());
    setBlocks(getBlocks());
    setFloors(getFloors());
    setReports(getReports());
    setProblems(getProblems());
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const handleSaveProject = () => {
    if (!projectForm.name || !projectForm.password) {
      toast({
        title: t.common.error,
        description: language === 'fr' ? 'Veuillez remplir tous les champs obligatoires' : 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
      name: projectForm.name,
      description: projectForm.description,
      password: projectForm.password,
      buildingType: 'immeuble',
      numberOfFloors: 0,
    };

    if (editingProject) {
      updateProject(editingProject.id, projectData);
    } else {
      createProject(projectData);
    }

    loadData();
    resetProjectForm();
    setProjectDialogOpen(false);
    toast({
      title: t.common.success,
      description: editingProject ? language === 'fr' ? 'Projet mis à jour' : 'Project updated' : language === 'fr' ? 'Projet créé' : 'Project created',
    });
  };

  const resetProjectForm = () => {
    setEditingProject(null);
    setProjectForm({
      name: '',
      description: '',
      password: '',
    });
  };

  const handleSaveBlock = () => {
    if (!blockForm.projectId || !blockForm.blockNumber || !blockForm.blockName) {
      toast({
        title: t.common.error,
        description: language === 'fr' ? 'Veuillez remplir tous les champs obligatoires' : 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const blockData: Omit<Block, 'id' | 'createdAt' | 'updatedAt'> = {
      projectId: blockForm.projectId,
      blockNumber: parseInt(blockForm.blockNumber),
      blockName: blockForm.blockName,
    };

    if (editingBlock) {
      updateBlock(editingBlock.id, blockData);
    } else {
      createBlock(blockData);
    }

    loadData();
    resetBlockForm();
    setBlockDialogOpen(false);
    toast({
      title: t.common.success,
      description: editingBlock ? language === 'fr' ? 'Bloc mis à jour' : 'Block updated' : language === 'fr' ? 'Bloc créé' : 'Block created',
    });
  };

  const resetBlockForm = () => {
    setEditingBlock(null);
    setBlockForm({
      projectId: '',
      blockNumber: '',
      blockName: '',
    });
  };

  const handleViewProject = (project: Project) => {
    setSelectedProjectForView(project);
    setProjectPasswordDialogOpen(true);
  };

  const handleOpenProjectBlocks = (project: Project) => {
    setSelectedProjectForBlocks(project);
  };

  const handleCloseProjectBlocks = () => {
    setSelectedProjectForBlocks(null);
    setExpandedBlocks(new Set());
  };

  const toggleBlockExpansion = (blockId: string) => {
    setExpandedBlocks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(blockId)) {
        newSet.delete(blockId);
      } else {
        newSet.add(blockId);
      }
      return newSet;
    });
  };

  const handleAddBlock = (projectId: string) => {
    setBlockForm({
      projectId: projectId,
      blockNumber: '',
      blockName: '',
    });
    setEditingBlock(null);
    setBlockDialogOpen(true);
  };

  const handleEditBlock = (block: Block) => {
    setEditingBlock(block);
    setBlockForm({
      projectId: block.projectId,
      blockNumber: block.blockNumber.toString(),
      blockName: block.blockName,
    });
    setBlockDialogOpen(true);
  };

  const handleAddFloor = (projectId: string, blockId: string) => {
    setFloorForm({
      projectId: projectId,
      blockId: blockId,
      floorNumber: '',
      floorName: '',
      ces: { inspected: false, date: '', notes: '', logements: [] },
      cet: { inspected: false, date: '', notes: '', logements: [] },
      coulageDate: '',
      coulageTime: '',
      verificationDate: '',
      verificationTime: '',
      status: 'notStarted',
      notes: '',
    });
    setEditingFloor(null);
    setFloorDialogOpen(true);
  };

  const handleEditFloor = (floor: Floor) => {
    setEditingFloor(floor);
    setFloorForm({
      projectId: floor.projectId,
      blockId: floor.blockId,
      floorNumber: floor.floorNumber.toString(),
      floorName: floor.floorName,
      ces: floor.ces || { inspected: false, date: '', notes: '', logements: [] },
      cet: floor.cet || { inspected: false, date: '', notes: '', logements: [] },
      coulageDate: floor.coulageDate || '',
      coulageTime: floor.coulageTime || '',
      verificationDate: floor.verificationDate || '',
      verificationTime: floor.verificationTime || '',
      status: floor.status,
      notes: floor.notes || '',
    });
    setFloorDialogOpen(true);
  };

  const handleAccessProject = () => {
    if (selectedProjectForView && selectedProjectForView.password === projectPassword) {
      setProjectPasswordDialogOpen(false);
      setProjectPassword('');
      setActiveTab('projects');
      toast({
        title: t.common.success,
        description: language === 'fr' ? 'Accès autorisé' : 'Access granted',
      });
    } else {
      toast({
        title: t.common.error,
        description: t.projects.wrongPassword,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteItem = () => {
    if (!deletingItem) return;

    if (deletingItem.type === 'project') {
      deleteProjectStorage(deletingItem.id);
    } else if (deletingItem.type === 'block') {
      deleteBlockStorage(deletingItem.id);
    } else if (deletingItem.type === 'floor') {
      deleteFloorStorage(deletingItem.id);
    } else if (deletingItem.type === 'report') {
      deleteReportStorage(deletingItem.id);
    } else if (deletingItem.type === 'problem') {
      deleteProblemStorage(deletingItem.id);
    }

    loadData();
    setDeleteDialogOpen(false);
    setDeletingItem(null);
    toast({
      title: t.common.success,
      description: language === 'fr' ? 'Élément supprimé' : 'Item deleted',
    });
  };

  const handleShareProject = (project: Project) => {
    const text = `${project.name}\n${t.projects.description}: ${project.description || ''}`;
    shareToWhatsApp(text);
  };

  const handleSaveReport = () => {
    if (!reportForm.projectId || !reportForm.date || !reportForm.description) {
      toast({
        title: t.common.error,
        description: language === 'fr' ? 'Veuillez remplir tous les champs' : 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    const reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt'> = {
      projectId: reportForm.projectId,
      type: reportForm.type,
      date: reportForm.date,
      description: reportForm.description,
    };

    if (editingReport) {
      updateReport(editingReport.id, reportData);
    } else {
      createReport(reportData);
    }

    loadData();
    resetReportForm();
    setReportDialogOpen(false);
    toast({
      title: t.common.success,
      description: language === 'fr' ? 'Rapport enregistré' : 'Report saved',
    });
  };

  const resetReportForm = () => {
    setEditingReport(null);
    setReportForm({
      projectId: '',
      type: 'pvVisite',
      date: '',
      description: '',
    });
  };

  const handleSaveProblem = () => {
    if (!problemForm.projectId || !problemForm.title || !problemForm.date) {
      toast({
        title: t.common.error,
        description: language === 'fr' ? 'Veuillez remplir tous les champs' : 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    const problemData: Omit<Problem, 'id' | 'createdAt' | 'updatedAt'> = {
      projectId: problemForm.projectId,
      title: problemForm.title,
      description: problemForm.description,
      date: problemForm.date,
      status: problemForm.status,
    };

    if (editingProblem) {
      updateProblem(editingProblem.id, problemData);
    } else {
      createProblem(problemData);
    }

    loadData();
    resetProblemForm();
    setProblemDialogOpen(false);
    toast({
      title: t.common.success,
      description: language === 'fr' ? 'Problème enregistré' : 'Problem saved',
    });
  };

  const resetProblemForm = () => {
    setEditingProblem(null);
    setProblemForm({
      projectId: '',
      title: '',
      description: '',
      date: '',
      status: 'open',
    });
  };

  const handleSaveFloor = () => {
    if (!floorForm.blockId || !floorForm.projectId || !floorForm.floorNumber || !floorForm.floorName) {
      toast({
        title: t.common.error,
        description: language === 'fr' ? 'Veuillez remplir tous les champs obligatoires' : 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const floorData: Omit<Floor, 'id' | 'createdAt' | 'updatedAt'> = {
      projectId: floorForm.projectId,
      blockId: floorForm.blockId,
      floorNumber: parseInt(floorForm.floorNumber),
      floorName: floorForm.floorName,
      ces: floorForm.ces.inspected ? {
        inspected: true,
        date: floorForm.ces.date || null,
        notes: floorForm.ces.notes,
        logements: floorForm.ces.logements || [],
      } : null,
      cet: floorForm.cet.inspected ? {
        inspected: true,
        date: floorForm.cet.date || null,
        notes: floorForm.cet.notes,
        logements: floorForm.cet.logements || [],
      } : null,
      coulageDate: floorForm.coulageDate || null,
      coulageTime: floorForm.coulageTime || null,
      verificationDate: floorForm.verificationDate || null,
      verificationTime: floorForm.verificationTime || null,
      status: floorForm.status,
      notes: floorForm.notes || '',
    };

    if (editingFloor) {
      updateFloor(editingFloor.id, floorData);
    } else {
      createFloor(floorData);
    }

    loadData();
    resetFloorForm();
    setFloorDialogOpen(false);
    toast({
      title: t.common.success,
      description: editingFloor ? language === 'fr' ? 'Étage mis à jour' : 'Floor updated' : language === 'fr' ? 'Étage créé' : 'Floor created',
    });
  };

  const resetFloorForm = () => {
    setEditingFloor(null);
    setFloorForm({
      projectId: '',
      blockId: '',
      floorNumber: '',
      floorName: '',
      ces: { inspected: false, date: '', notes: '', logements: [] },
      cet: { inspected: false, date: '', notes: '', logements: [] },
      coulageDate: '',
      coulageTime: '',
      verificationDate: '',
      verificationTime: '',
      status: 'notStarted',
      notes: '',
    });
  };

  const addLogement = (inspectionType: 'ces' | 'cet') => {
    const newLogement: Logement = {
      id: crypto.randomUUID(),
      type: '',
      notes: '',
    };
    if (inspectionType === 'ces') {
      setFloorForm({
        ...floorForm,
        ces: {
          ...floorForm.ces,
          logements: [...(floorForm.ces.logements || []), newLogement],
        },
      });
    } else {
      setFloorForm({
        ...floorForm,
        cet: {
          ...floorForm.cet,
          logements: [...(floorForm.cet.logements || []), newLogement],
        },
      });
    }
  };

  const removeLogement = (inspectionType: 'ces' | 'cet', logementId: string) => {
    if (inspectionType === 'ces') {
      setFloorForm({
        ...floorForm,
        ces: {
          ...floorForm.ces,
          logements: (floorForm.ces.logements || []).filter(l => l.id !== logementId),
        },
      });
    } else {
      setFloorForm({
        ...floorForm,
        cet: {
          ...floorForm.cet,
          logements: (floorForm.cet.logements || []).filter(l => l.id !== logementId),
        },
      });
    }
  };

  const updateLogement = (
    inspectionType: 'ces' | 'cet',
    logementId: string,
    field: 'type' | 'notes',
    value: string
  ) => {
    if (inspectionType === 'ces') {
      setFloorForm({
        ...floorForm,
        ces: {
          ...floorForm.ces,
          logements: (floorForm.ces.logements || []).map(l =>
            l.id === logementId ? { ...l, [field]: value } : l
          ),
        },
      });
    } else {
      setFloorForm({
        ...floorForm,
        cet: {
          ...floorForm.cet,
          logements: (floorForm.cet.logements || []).map(l =>
            l.id === logementId ? { ...l, [field]: value } : l
          ),
        },
      });
    }
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || (language === 'fr' ? 'Projet inconnu' : 'Unknown project');
  };

  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground pb-16">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            <h1 className="text-xl font-bold">BinaCore</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
            >
              <Globe className="h-5 w-5" />
              <span className="sr-only">{t.settings.language}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {mounted && (theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
              <span className="sr-only">{t.settings.theme}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">{t.dashboard.title}</h2>
            </div>

            {projects.length === 0 ? (
              <Card className="p-12 text-center">
                <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg text-muted-foreground">{t.dashboard.noProjects}</p>
                <Button onClick={() => { resetProjectForm(); setProjectDialogOpen(true); }} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  {t.dashboard.addProject}
                </Button>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.slice(0, 6).map((project) => {
                  const progress = getProjectProgress(project);
                  return (
                    <Card key={project.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          <Badge variant={progress === 100 ? 'default' : 'secondary'}>
                            {progress}%
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <Progress value={progress} className="h-2" />
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{t.dashboard.lastUpdate}</span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(project.updatedAt, language)}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleViewProject(project)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              {t.dashboard.viewProject}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            {!selectedProjectForBlocks ? (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold">{t.projects.title}</h2>
                  <Button onClick={() => { resetProjectForm(); setProjectDialogOpen(true); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t.projects.addProject}
                  </Button>
                </div>

                {projects.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-lg text-muted-foreground">{t.projects.noProjectsFound}</p>
                  </Card>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => {
                      const progress = getProjectProgress(project);
                      const projectBlocks = getBlocksByProject(project.id);
                      return (
                        <Card key={project.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-lg line-clamp-2">{project.name}</CardTitle>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Menu className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleViewProject(project)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    {t.common.view}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleOpenProjectBlocks(project)}>
                                    <Layers className="h-4 w-4 mr-2" />
                                    {language === 'fr' ? 'Voir Blocs' : 'View Blocks'}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => { setEditingProject(project); setProjectForm({
                                    name: project.name,
                                    description: project.description || '',
                                    password: project.password,
                                  }); setProjectDialogOpen(true); }}>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    {t.common.edit}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleShareProject(project)}>
                                    <Share2 className="h-4 w-4 mr-2" />
                                    {t.common.share}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setDeletingItem({ type: 'project', id: project.id });
                                      setDeleteDialogOpen(true);
                                    }}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {t.common.delete}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">{language === 'fr' ? 'Blocs' : 'Blocks'}</p>
                                <p className="font-medium">{projectBlocks.length}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">{t.dashboard.progress}</p>
                                <p className="font-medium">{progress}%</p>
                              </div>
                            </div>
                            <Progress value={progress} className="h-2" />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => handleOpenProjectBlocks(project)}
                              >
                                <Layers className="h-4 w-4 mr-1" />
                                {language === 'fr' ? 'Voir Blocs' : 'View Blocks'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              // Detailed Project View with Blocks and Floors
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={handleCloseProjectBlocks}>
                      {language === 'fr' ? '← Retour' : '← Back'}
                    </Button>
                    <div>
                      <h2 className="text-3xl font-bold">{selectedProjectForBlocks.name}</h2>
                    </div>
                  </div>
                  <Button onClick={() => handleAddBlock(selectedProjectForBlocks.id)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {language === 'fr' ? 'Ajouter Bloc' : 'Add Block'}
                  </Button>
                </div>

                {(() => {
                  const projectBlocks = getBlocksByProject(selectedProjectForBlocks.id);
                  if (projectBlocks.length === 0) {
                    return (
                      <Card className="p-12 text-center">
                        <Layers className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <p className="text-lg text-muted-foreground">
                          {language === 'fr' ? 'Aucun bloc dans ce projet' : 'No blocks in this project'}
                        </p>
                      </Card>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      {projectBlocks.map((block) => {
                        const blockFloors = getFloorsByBlock(block.id);
                        const isExpanded = expandedBlocks.has(block.id);
                        return (
                          <Card key={block.id}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => toggleBlockExpansion(block.id)}
                                  >
                                    {isExpanded ? (
                                      <span className="transform rotate-90">▶</span>
                                    ) : (
                                      <span>▶</span>
                                    )}
                                  </Button>
                                  <div>
                                    <CardTitle className="text-lg">
                                      {language === 'fr' ? 'Bloc' : 'Block'} {block.blockNumber} - {block.blockName}
                                    </CardTitle>
                                    <CardDescription>
                                      {blockFloors.length} {language === 'fr' ? 'étage(s)' : 'floor(s)'}
                                    </CardDescription>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <Menu className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => handleEditBlock(block)}>
                                        <Pencil className="h-4 w-4 mr-2" />
                                        {t.common.edit}
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setDeletingItem({ type: 'block', id: block.id });
                                          setDeleteDialogOpen(true);
                                        }}
                                        className="text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        {t.common.delete}
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </CardHeader>
                            {isExpanded && (
                              <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">
                                    {language === 'fr' ? 'Étages' : 'Floors'}
                                  </h4>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleAddFloor(selectedProjectForBlocks.id, block.id)}
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    {language === 'fr' ? 'Ajouter Étage' : 'Add Floor'}
                                  </Button>
                                </div>
                                {blockFloors.length === 0 ? (
                                  <div className="text-center py-8 text-muted-foreground">
                                    {language === 'fr' ? 'Aucun étage dans ce bloc' : 'No floors in this block'}
                                  </div>
                                ) : (
                                  <div className="grid gap-3">
                                    {blockFloors.map((floor) => (
                                      <div
                                        key={floor.id}
                                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                                      >
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2">
                                            <Badge variant="secondary">
                                              {floor.floorNumber}
                                            </Badge>
                                            <span className="font-medium">{floor.floorName}</span>
                                          </div>
                                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                            <span>
                                              {language === 'fr' ? 'Statut' : 'Status'}: 
                                              <Badge
                                                variant={
                                                  floor.status === 'completed' ? 'default' :
                                                  floor.status === 'inProgress' ? 'secondary' : 'outline'
                                                }
                                              >
                                                {t.floors.statuses[floor.status]}
                                              </Badge>
                                            </span>
                                            {(floor.coulageDate || floor.coulageTime) && (
                                              <span>
                                                {language === 'fr' ? 'Coulage' : 'Coulage'}: 
                                                {floor.coulageDate && formatDate(floor.coulageDate, language)}
                                                {floor.coulageTime && ` ${floor.coulageTime}`}
                                              </span>
                                            )}
                                            {(floor.verificationDate || floor.verificationTime) && (
                                              <span>
                                                {language === 'fr' ? 'Vérification' : 'Verification'}: 
                                                {floor.verificationDate && formatDate(floor.verificationDate, language)}
                                                {floor.verificationTime && ` ${floor.verificationTime}`}
                                              </span>
                                            )}
                                            {(floor.ces?.logements && floor.ces.logements.length > 0) && (
                                              <span>
                                                CES: {floor.ces.logements.map(l => t.floors.cesCet.logementTypes[l.type as keyof typeof t.floors.cesCet.logementTypes] || l.type).join(', ')}
                                              </span>
                                            )}
                                            {(floor.cet?.logements && floor.cet.logements.length > 0) && (
                                              <span>
                                                CET: {floor.cet.logements.map(l => t.floors.cesCet.logementTypes[l.type as keyof typeof t.floors.cesCet.logementTypes] || l.type).join(', ')}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                              <Menu className="h-4 w-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEditFloor(floor)}>
                                              <Pencil className="h-4 w-4 mr-2" />
                                              {t.common.edit}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                              onClick={() => {
                                                setDeletingItem({ type: 'floor', id: floor.id });
                                                setDeleteDialogOpen(true);
                                              }}
                                              className="text-destructive"
                                            >
                                              <Trash2 className="h-4 w-4 mr-2" />
                                              {t.common.delete}
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </CardContent>
                            )}
                          </Card>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">{t.reports.title}</h2>
              <Button onClick={() => { resetReportForm(); setReportDialogOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                {t.reports.addReport}
              </Button>
            </div>

            {reports.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg text-muted-foreground">{t.reports.noReports}</p>
              </Card>
            ) : (
              <ScrollArea className="h-[600px]">
                <div className="grid gap-4">
                  {reports.map((report) => (
                    <Card key={report.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge>{t.reports.types[report.type]}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {getProjectName(report.projectId)}
                              </span>
                            </div>
                            <h3 className="font-semibold mb-2">{report.description}</h3>
                            <p className="text-sm text-muted-foreground flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(report.date, language)}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Menu className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                const project = projects.find(p => p.id === report.projectId);
                                if (project) {
                                  setSelectedProjectForView(project);
                                  setProjectPasswordDialogOpen(true);
                                }
                              }}>
                                <Eye className="h-4 w-4 mr-2" />
                                {t.common.view}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setEditingReport(report); setReportForm({
                                projectId: report.projectId,
                                type: report.type,
                                date: report.date,
                                description: report.description,
                              }); setReportDialogOpen(true); }}>
                                <Pencil className="h-4 w-4 mr-2" />
                                {t.common.edit}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                const text = `${t.reports.types[report.type]}\n${report.description}\n${formatDate(report.date, language)}`;
                                shareToWhatsApp(text);
                              }}>
                                <Share2 className="h-4 w-4 mr-2" />
                                {t.common.share}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setDeletingItem({ type: 'report', id: report.id });
                                  setDeleteDialogOpen(true);
                                }}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t.common.delete}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          {/* Problems Tab */}
          <TabsContent value="problems" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold">{t.problems.title}</h2>
              <Button onClick={() => { resetProblemForm(); setProblemDialogOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                {t.problems.addProblem}
              </Button>
            </div>

            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t.common.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t.common.filter} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.common.all}</SelectItem>
                  <SelectItem value="open">{t.problems.statuses.open}</SelectItem>
                  <SelectItem value="inProgress">{t.problems.statuses.inProgress}</SelectItem>
                  <SelectItem value="resolved">{t.problems.statuses.resolved}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredProblems.length === 0 ? (
              <Card className="p-12 text-center">
                <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg text-muted-foreground">
                  {searchQuery || statusFilter !== 'all' ? language === 'fr' ? 'Aucun problème trouvé' : 'No problems found' : t.problems.noProblems}
                </p>
              </Card>
            ) : (
              <ScrollArea className="h-[600px]">
                <div className="grid gap-4">
                  {filteredProblems.map((problem) => (
                    <Card key={problem.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {problem.status === 'open' && (
                                <Badge variant="destructive">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  {t.problems.statuses.open}
                                </Badge>
                              )}
                              {problem.status === 'inProgress' && (
                                <Badge className="bg-orange-500 hover:bg-orange-600">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {t.problems.statuses.inProgress}
                                </Badge>
                              )}
                              {problem.status === 'resolved' && (
                                <Badge className="bg-green-500 hover:bg-green-600">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  {t.problems.statuses.resolved}
                                </Badge>
                              )}
                              <span className="text-sm text-muted-foreground">
                                {getProjectName(problem.projectId)}
                              </span>
                            </div>
                            <h3 className="font-semibold mb-2">{problem.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{problem.description}</p>
                            <p className="text-sm text-muted-foreground flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(problem.date, language)}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Menu className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                const project = projects.find(p => p.id === problem.projectId);
                                if (project) {
                                  setSelectedProjectForView(project);
                                  setProjectPasswordDialogOpen(true);
                                }
                              }}>
                                <Eye className="h-4 w-4 mr-2" />
                                {t.common.view}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setEditingProblem(problem); setProblemForm({
                                projectId: problem.projectId,
                                title: problem.title,
                                description: problem.description,
                                date: problem.date,
                                status: problem.status,
                              }); setProblemDialogOpen(true); }}>
                                <Pencil className="h-4 w-4 mr-2" />
                                {t.common.edit}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                const text = `${problem.title}\n${problem.description}\n${t.problems.status}: ${t.problems.statuses[problem.status]}`;
                                shareToWhatsApp(text);
                              }}>
                                <Share2 className="h-4 w-4 mr-2" />
                                {t.common.share}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setDeletingItem({ type: 'problem', id: problem.id });
                                  setDeleteDialogOpen(true);
                                }}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t.common.delete}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-3xl font-bold">{t.settings.title}</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t.settings.language}</CardTitle>
                  <CardDescription>
                    {language === 'fr' ? 'Choisissez votre langue préférée' : 'Choose your preferred language'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant={language === 'fr' ? 'default' : 'outline'}
                      onClick={() => setLanguage('fr')}
                      className="flex-1"
                    >
                      Français
                    </Button>
                    <Button
                      variant={language === 'en' ? 'default' : 'outline'}
                      onClick={() => setLanguage('en')}
                      className="flex-1"
                    >
                      English
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t.settings.theme}</CardTitle>
                  <CardDescription>
                    {language === 'fr' ? 'Choisissez votre thème préféré' : 'Choose your preferred theme'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      onClick={() => setTheme('dark')}
                      className="flex-1"
                    >
                      <Moon className="h-4 w-4 mr-2" />
                      {t.settings.dark}
                    </Button>
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      onClick={() => setTheme('light')}
                      className="flex-1"
                    >
                      <Sun className="h-4 w-4 mr-2" />
                      {t.settings.light}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{t.footer.madeBy} Dz Build</CardTitle>
                <CardDescription>BinaCore v1.0.0</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-around py-2">
          <Button
            variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setActiveTab('dashboard')}
            className="flex-col h-14 w-14"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-[10px] mt-1">{t.navigation.dashboard}</span>
          </Button>
          <Button
            variant={activeTab === 'projects' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setActiveTab('projects')}
            className="flex-col h-14 w-14"
          >
            <Building2 className="h-5 w-5" />
            <span className="text-[10px] mt-1">{t.navigation.projects}</span>
          </Button>
          <Button
            variant={activeTab === 'reports' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setActiveTab('reports')}
            className="flex-col h-14 w-14"
          >
            <FileText className="h-5 w-5" />
            <span className="text-[10px] mt-1">{t.navigation.reports}</span>
          </Button>
          <Button
            variant={activeTab === 'problems' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setActiveTab('problems')}
            className="flex-col h-14 w-14"
          >
            <AlertTriangle className="h-5 w-5" />
            <span className="text-[10px] mt-1">{t.navigation.problems}</span>
          </Button>
          <Button
            variant={activeTab === 'settings' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setActiveTab('settings')}
            className="flex-col h-14 w-14"
          >
            <Settings className="h-5 w-5" />
            <span className="text-[10px] mt-1">{t.navigation.settings}</span>
          </Button>
        </div>
      </nav>

      {/* Project Dialog */}
      <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? t.projects.editProject : t.projects.addProject}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{t.projects.projectName} *</Label>
                <Input
                  id="name"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t.projects.password} *</Label>
                <Input
                  id="password"
                  type="password"
                  value={projectForm.password}
                  onChange={(e) => setProjectForm({ ...projectForm, password: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t.projects.description}</Label>
              <Textarea
                id="description"
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                placeholder={language === 'fr' ? 'Décrivez votre projet...' : 'Describe your project...'}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { resetProjectForm(); setProjectDialogOpen(false); }}>
              {t.common.cancel}
            </Button>
            <Button onClick={handleSaveProject}>{t.common.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Dialog */}
      <Dialog open={projectPasswordDialogOpen} onOpenChange={setProjectPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.projects.enterPassword}</DialogTitle>
            <DialogDescription>
              {selectedProjectForView?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="password">{t.projects.password}</Label>
              <Input
                id="password"
                type="password"
                value={projectPassword}
                onChange={(e) => setProjectPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAccessProject()}
                placeholder="••••••••"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setProjectPassword(''); setProjectPasswordDialogOpen(false); }}>
              {t.common.cancel}
            </Button>
            <Button onClick={handleAccessProject}>{t.projects.accessProject}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block Dialog */}
      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingBlock 
                ? (language === 'fr' ? 'Modifier le Bloc' : 'Edit Block') 
                : (language === 'fr' ? 'Ajouter un Bloc' : 'Add Block')
              }
            </DialogTitle>
            <DialogDescription>
              {editingBlock ? (
                language === 'fr' ? 'Modifier les informations du bloc' : 'Update block information'
              ) : (
                language === 'fr' ? 'Ajouter un nouveau bloc au projet' : 'Add a new block to the project'
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="blockProject">{t.reports.linkProject}</Label>
              <Select
                value={blockForm.projectId}
                onValueChange={(value) => setBlockForm({ ...blockForm, projectId: value })}
                disabled={!!editingBlock}
              >
                <SelectTrigger id="blockProject">
                  <SelectValue placeholder={language === 'fr' ? 'Sélectionner un projet' : 'Select a project'} />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="blockNumber">{language === 'fr' ? 'Numéro de bloc *' : 'Block Number *'}</Label>
              <Input
                id="blockNumber"
                type="number"
                min="1"
                value={blockForm.blockNumber}
                onChange={(e) => setBlockForm({ ...blockForm, blockNumber: e.target.value })}
                placeholder={language === 'fr' ? '1' : '1'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blockName">{language === 'fr' ? 'Nom du bloc *' : 'Block Name *'}</Label>
              <Input
                id="blockName"
                value={blockForm.blockName}
                onChange={(e) => setBlockForm({ ...blockForm, blockName: e.target.value })}
                placeholder={language === 'fr' ? 'Ex: Bloc A' : 'Ex: Block A'}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { resetBlockForm(); setBlockDialogOpen(false); }}>
              {t.common.cancel}
            </Button>
            <Button onClick={handleSaveBlock}>{t.common.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingReport ? t.reports.editReport : t.reports.addReport}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reportProject">{t.reports.linkProject} *</Label>
              <Select
                value={reportForm.projectId}
                onValueChange={(value) => setReportForm({ ...reportForm, projectId: value })}
              >
                <SelectTrigger id="reportProject">
                  <SelectValue placeholder={language === 'fr' ? 'Sélectionner un projet' : 'Select a project'} />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reportType">{t.reports.reportType}</Label>
              <Select
                value={reportForm.type}
                onValueChange={(value: any) => setReportForm({ ...reportForm, type: value })}
              >
                <SelectTrigger id="reportType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pvVisite">{t.reports.types.pvVisite}</SelectItem>
                  <SelectItem value="pvConstat">{t.reports.types.pvConstat}</SelectItem>
                  <SelectItem value="rapport">{t.reports.types.rapport}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reportDate">{t.reports.date} *</Label>
              <Input
                id="reportDate"
                type="date"
                value={reportForm.date}
                onChange={(e) => setReportForm({ ...reportForm, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reportDescription">{t.reports.description} *</Label>
              <Textarea
                id="reportDescription"
                value={reportForm.description}
                onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { resetReportForm(); setReportDialogOpen(false); }}>
              {t.common.cancel}
            </Button>
            <Button onClick={handleSaveReport}>{t.common.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Problem Dialog */}
      <Dialog open={problemDialogOpen} onOpenChange={setProblemDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProblem ? t.problems.editProblem : t.problems.addProblem}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="problemProject">{t.problems.linkedProject} *</Label>
              <Select
                value={problemForm.projectId}
                onValueChange={(value) => setProblemForm({ ...problemForm, projectId: value })}
              >
                <SelectTrigger id="problemProject">
                  <SelectValue placeholder={language === 'fr' ? 'Sélectionner un projet' : 'Select a project'} />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="problemTitle">{t.problems.title} *</Label>
              <Input
                id="problemTitle"
                value={problemForm.title}
                onChange={(e) => setProblemForm({ ...problemForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="problemDescription">{t.problems.description}</Label>
              <Textarea
                id="problemDescription"
                value={problemForm.description}
                onChange={(e) => setProblemForm({ ...problemForm, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="problemDate">{t.problems.date} *</Label>
                <Input
                  id="problemDate"
                  type="date"
                  value={problemForm.date}
                  onChange={(e) => setProblemForm({ ...problemForm, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="problemStatus">{t.problems.status}</Label>
                <Select
                  value={problemForm.status}
                  onValueChange={(value: any) => setProblemForm({ ...problemForm, status: value })}
                >
                  <SelectTrigger id="problemStatus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">{t.problems.statuses.open}</SelectItem>
                    <SelectItem value="inProgress">{t.problems.statuses.inProgress}</SelectItem>
                    <SelectItem value="resolved">{t.problems.statuses.resolved}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { resetProblemForm(); setProblemDialogOpen(false); }}>
              {t.common.cancel}
            </Button>
            <Button onClick={handleSaveProblem}>{t.common.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floor Dialog */}
      <Dialog open={floorDialogOpen} onOpenChange={setFloorDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingFloor ? t.floors.editFloor : t.floors.addFloor}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Gros Œuvre Section */}
            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg mb-4">{t.floors.grosOeuvre}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="floorProject">{t.reports.linkProject} *</Label>
                  <Select
                    value={floorForm.projectId}
                    onValueChange={(value) => {
                      setFloorForm({ ...floorForm, projectId: value, blockId: '' });
                    }}
                    disabled={!!editingFloor}
                  >
                    <SelectTrigger id="floorProject">
                      <SelectValue placeholder={language === 'fr' ? 'Sélectionner un projet' : 'Select a project'} />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="floorBlock">{language === 'fr' ? 'Bloc *' : 'Block *'}</Label>
                  <Select
                    value={floorForm.blockId}
                    onValueChange={(value) => setFloorForm({ ...floorForm, blockId: value })}
                    disabled={!floorForm.projectId}
                  >
                    <SelectTrigger id="floorBlock">
                      <SelectValue placeholder={language === 'fr' ? 'Sélectionner un bloc' : 'Select a block'} />
                    </SelectTrigger>
                    <SelectContent>
                      {floorForm.projectId && getBlocksByProject(floorForm.projectId).map((block) => (
                        <SelectItem key={block.id} value={block.id}>
                          {language === 'fr' ? 'Bloc' : 'Block'} {block.blockNumber} - {block.blockName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="floorNumber">{t.floors.floorNumber} *</Label>
                  <Input
                    id="floorNumber"
                    type="number"
                    min="1"
                    value={floorForm.floorNumber}
                    onChange={(e) => setFloorForm({ ...floorForm, floorNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="floorName">{t.floors.floorName} *</Label>
                  <Input
                    id="floorName"
                    value={floorForm.floorName}
                    onChange={(e) => setFloorForm({ ...floorForm, floorName: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Status & Notes */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="floorStatus">{t.floors.status}</Label>
                <Select
                  value={floorForm.status}
                  onValueChange={(value: any) => setFloorForm({ ...floorForm, status: value })}
                >
                  <SelectTrigger id="floorStatus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="notStarted">{t.floors.statuses.notStarted}</SelectItem>
                    <SelectItem value="inProgress">{t.floors.statuses.inProgress}</SelectItem>
                    <SelectItem value="completed">{t.floors.statuses.completed}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="floorNotes">{t.floors.notes}</Label>
                <Textarea
                  id="floorNotes"
                  value={floorForm.notes || ''}
                  onChange={(e) => setFloorForm({ ...floorForm, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            {/* Times Section */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">{t.floors.times.title}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="coulageDate">{t.floors.times.coulageDate}</Label>
                  <Input
                    id="coulageDate"
                    type="date"
                    value={floorForm.coulageDate}
                    onChange={(e) => setFloorForm({ ...floorForm, coulageDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coulageTime">{t.floors.times.coulageTime}</Label>
                  <Input
                    id="coulageTime"
                    type="time"
                    value={floorForm.coulageTime}
                    onChange={(e) => setFloorForm({ ...floorForm, coulageTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="verificationDate">{t.floors.times.verificationDate}</Label>
                  <Input
                    id="verificationDate"
                    type="date"
                    value={floorForm.verificationDate}
                    onChange={(e) => setFloorForm({ ...floorForm, verificationDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="verificationTime">{t.floors.times.verificationTime}</Label>
                  <Input
                    id="verificationTime"
                    type="time"
                    value={floorForm.verificationTime}
                    onChange={(e) => setFloorForm({ ...floorForm, verificationTime: e.target.value })}
                  />
                </div>
              </div>
            </div>
            
            {/* CES/CET Section */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">{t.floors.cesCet.title}</h3>
              <div className="space-y-4">
                {/* CES Section */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      id="cesInspected"
                      checked={floorForm.ces.inspected}
                      onChange={(e) => setFloorForm({ ...floorForm, ces: { ...floorForm.ces, inspected: e.target.checked } })}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="cesInspected" className="font-medium">{t.floors.cesCet.ces}</Label>
                  </div>
                  {floorForm.ces.inspected && (
                    <>
                      <div className="space-y-2">
                        <Input
                          type="date"
                          value={floorForm.ces.date || ''}
                          onChange={(e) => setFloorForm({ ...floorForm, ces: { ...floorForm.ces, date: e.target.value } })}
                        />
                      </div>
                      <Textarea
                        value={floorForm.ces.notes || ''}
                        onChange={(e) => setFloorForm({ ...floorForm, ces: { ...floorForm.ces, notes: e.target.value } })}
                        rows={2}
                        placeholder={language === 'fr' ? 'Notes CES...' : 'CES notes...'}
                      />
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{t.floors.cesCet.logements.title}</h4>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => addLogement('ces')}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            {t.floors.cesCet.logements.add}
                          </Button>
                        </div>
                        {(!floorForm.ces.logements || floorForm.ces.logements.length === 0) && (
                          <p className="text-sm text-muted-foreground">{t.floors.cesCet.logements.noLogements}</p>
                        )}
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {floorForm.ces.logements && floorForm.ces.logements.length > 0 && floorForm.ces.logements.map((logement, index) => (
                            <div key={logement.id} className="border rounded-md p-3 space-y-2">
                              <div className="flex items-start justify-between">
                                <span className="text-sm font-medium">{language === 'fr' ? 'Logement' : 'Housing'} {index + 1}</span>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeLogement('ces', logement.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <Label htmlFor={`ces-logement-${logement.id}-type`} className="text-sm">{t.floors.cesCet.logements.logementType}</Label>
                                  <Select
                                    value={logement.type}
                                    onValueChange={(value) => updateLogement('ces', logement.id, 'type', value)}
                                  >
                                    <SelectTrigger id={`ces-logement-${logement.id}-type`}>
                                      <SelectValue placeholder={language === 'fr' ? 'Sélectionner le type' : 'Select type'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="studio">{t.floors.cesCet.logementTypes.studio}</SelectItem>
                                      <SelectItem value="f1">{t.floors.cesCet.logementTypes.f1}</SelectItem>
                                      <SelectItem value="f2">{t.floors.cesCet.logementTypes.f2}</SelectItem>
                                      <SelectItem value="f3">{t.floors.cesCet.logementTypes.f3}</SelectItem>
                                      <SelectItem value="f4">{t.floors.cesCet.logementTypes.f4}</SelectItem>
                                      <SelectItem value="f5">{t.floors.cesCet.logementTypes.f5}</SelectItem>
                                      <SelectItem value="t1">{t.floors.cesCet.logementTypes.t1}</SelectItem>
                                      <SelectItem value="t2">{t.floors.cesCet.logementTypes.t2}</SelectItem>
                                      <SelectItem value="t3">{t.floors.cesCet.logementTypes.t3}</SelectItem>
                                      <SelectItem value="t4">{t.floors.cesCet.logementTypes.t4}</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor={`ces-logement-${logement.id}-notes`} className="text-sm">{t.floors.cesCet.logements.notes}</Label>
                                  <Input
                                    id={`ces-logement-${logement.id}-notes`}
                                    value={logement.notes || ''}
                                    onChange={(e) => updateLogement('ces', logement.id, 'notes', e.target.value)}
                                    placeholder={language === 'fr' ? 'Notes...' : 'Notes...'}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {/* CET Section */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      id="cetInspected"
                      checked={floorForm.cet.inspected}
                      onChange={(e) => setFloorForm({ ...floorForm, cet: { ...floorForm.cet, inspected: e.target.checked } })}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="cetInspected" className="font-medium">{t.floors.cesCet.cet}</Label>
                  </div>
                  {floorForm.cet.inspected && (
                    <>
                      <div className="space-y-2">
                        <Input
                          type="date"
                          value={floorForm.cet.date || ''}
                          onChange={(e) => setFloorForm({ ...floorForm, cet: { ...floorForm.cet, date: e.target.value } })}
                        />
                      </div>
                      <Textarea
                        value={floorForm.cet.notes || ''}
                        onChange={(e) => setFloorForm({ ...floorForm, cet: { ...floorForm.cet, notes: e.target.value } })}
                        rows={2}
                        placeholder={language === 'fr' ? 'Notes CET...' : 'CET notes...'}
                      />
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{t.floors.cesCet.logements.title}</h4>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => addLogement('cet')}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            {t.floors.cesCet.logements.add}
                          </Button>
                        </div>
                        {(!floorForm.cet.logements || floorForm.cet.logements.length === 0) && (
                          <p className="text-sm text-muted-foreground">{t.floors.cesCet.logements.noLogements}</p>
                        )}
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {floorForm.cet.logements && floorForm.cet.logements.length > 0 && floorForm.cet.logements.map((logement, index) => (
                            <div key={logement.id} className="border rounded-md p-3 space-y-2">
                              <div className="flex items-start justify-between">
                                <span className="text-sm font-medium">{language === 'fr' ? 'Logement' : 'Housing'} {index + 1}</span>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeLogement('cet', logement.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <Label htmlFor={`cet-logement-${logement.id}-type`} className="text-sm">{t.floors.cesCet.logements.logementType}</Label>
                                  <Select
                                    value={logement.type}
                                    onValueChange={(value) => updateLogement('cet', logement.id, 'type', value)}
                                  >
                                    <SelectTrigger id={`cet-logement-${logement.id}-type`}>
                                      <SelectValue placeholder={language === 'fr' ? 'Sélectionner le type' : 'Select type'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="studio">{t.floors.cesCet.logementTypes.studio}</SelectItem>
                                      <SelectItem value="f1">{t.floors.cesCet.logementTypes.f1}</SelectItem>
                                      <SelectItem value="f2">{t.floors.cesCet.logementTypes.f2}</SelectItem>
                                      <SelectItem value="f3">{t.floors.cesCet.logementTypes.f3}</SelectItem>
                                      <SelectItem value="f4">{t.floors.cesCet.logementTypes.f4}</SelectItem>
                                      <SelectItem value="f5">{t.floors.cesCet.logementTypes.f5}</SelectItem>
                                      <SelectItem value="t1">{t.floors.cesCet.logementTypes.t1}</SelectItem>
                                      <SelectItem value="t2">{t.floors.cesCet.logementTypes.t2}</SelectItem>
                                      <SelectItem value="t3">{t.floors.cesCet.logementTypes.t3}</SelectItem>
                                      <SelectItem value="t4">{t.floors.cesCet.logementTypes.t4}</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor={`cet-logement-${logement.id}-notes`} className="text-sm">{t.floors.cesCet.logements.notes}</Label>
                                  <Input
                                    id={`cet-logement-${logement.id}-notes`}
                                    value={logement.notes || ''}
                                    onChange={(e) => updateLogement('cet', logement.id, 'notes', e.target.value)}
                                    placeholder={language === 'fr' ? 'Notes...' : 'Notes...'}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { resetFloorForm(); setFloorDialogOpen(false); }}>
              {t.common.cancel}
            </Button>
            <Button onClick={handleSaveFloor}>{t.common.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.common.deleteConfirm}</AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'fr' 
                ? 'Cette action est irréversible. Voulez-vous vraiment continuer ?'
                : 'This action cannot be undone. Do you really want to continue?'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} className="bg-destructive hover:bg-destructive/90">
              {t.common.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

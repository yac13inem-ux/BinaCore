export type Language = 'fr' | 'en';

export type Translations = {
  dashboard: {
    title: string;
    latestProgress: string;
    progress: string;
    lastUpdate: string;
    addProject: string;
    viewProject: string;
    noProjects: string;
  };
  projects: {
    title: string;
    addProject: string;
    editProject: string;
    viewProject: string;
    deleteProject: string;
    shareProject: string;
    projectName: string;
    password: string;
    description: string;
    buildingType: string;
    numberOfFloors: string;
    rebarInspectionDate: string;
    concretePouringDate: string;
    confirmPassword: string;
    enterPassword: string;
    passwordRequired: string;
    wrongPassword: string;
    accessProject: string;
    cancel: string;
    save: string;
    projectDetails: string;
    noProjectsFound: string;
    buildingTypeOptions: {
      immeuble: string;
      villa: string;
      bureau: string;
      commercial: string;
      other: string;
    };
    blocks: {
      title: string;
      addBlock: string;
      editBlock: string;
      deleteBlock: string;
      blockName: string;
      blockNumber: string;
      noBlocks: string;
    };
  };
  floors: {
    title: string;
    addFloor: string;
    editFloor: string;
    viewFloor: string;
    deleteFloor: string;
    shareFloor: string;
    floorName: string;
    floorNumber: string;
    grosOeuvre: string;
    rebarInspectionDate: string;
    concretePouringDate: string;
    notes: string;
    status: string;
    statuses: {
      notStarted: string;
      inProgress: string;
      completed: string;
    };
    save: string;
    cancel: string;
    noFloors: string;
    noFloorsForProject: string;
    cesCet: {
      title: string;
      ces: string;
      cet: string;
    };
  };
  reports: {
    title: string;
    addReport: string;
    editReport: string;
    viewReport: string;
    deleteReport: string;
    shareReport: string;
    reportType: string;
    date: string;
    description: string;
    linkProject: string;
    types: {
      pvVisite: string;
      pvConstat: string;
      rapport: string;
    };
    save: string;
    cancel: string;
    noReports: string;
    noReportsForProject: string;
  };
  problems: {
    title: string;
    addProblem: string;
    editProblem: string;
    viewProblem: string;
    deleteProblem: string;
    shareProblem: string;
    problemTitle: string;
    description: string;
    date: string;
    linkedProject: string;
    status: string;
    statuses: {
      open: string;
      inProgress: string;
      resolved: string;
    };
    save: string;
    cancel: string;
    noProblems: string;
    noProblemsForProject: string;
  };
  settings: {
    title: string;
    language: string;
    theme: string;
    dark: string;
    light: string;
  };
  common: {
    view: string;
    edit: string;
    delete: string;
    share: string;
    cancel: string;
    save: string;
    confirm: string;
    deleteConfirm: string;
    shareViaWhatsApp: string;
    shareViaSystem: string;
    search: string;
    filter: string;
    all: string;
    loading: string;
    success: string;
    error: string;
    actions: string;
  };
  footer: {
    madeBy: string;
    copyright: string;
  };
  navigation: {
    dashboard: string;
    projects: string;
    floors: string;
    reports: string;
    problems: string;
    settings: string;
  };
  cesCet: {
    title: string;
    ces: string;
    cet: string;
    tracking: string;
  };
};

export const translations: Record<Language, Translations> = {
  fr: {
    dashboard: {
      title: 'Tableau de bord',
      latestProgress: 'Progression récente',
      progress: 'Progression',
      lastUpdate: 'Dernière mise à jour',
      addProject: 'Ajouter un projet',
      viewProject: 'Voir le projet',
      noProjects: 'Aucun projet pour le moment',
    },
    projects: {
      title: 'Projets',
      addProject: 'Ajouter un projet',
      editProject: 'Modifier le projet',
      viewProject: 'Voir le projet',
      deleteProject: 'Supprimer le projet',
      shareProject: 'Partager le projet',
      projectName: 'Nom du projet',
      password: 'Mot de passe',
      description: 'Description',
      buildingType: 'Type de bâtiment',
      numberOfFloors: 'Nombre d\'étages',
      rebarInspectionDate: 'Date de vérification du ferraillage',
      concretePouringDate: 'Date de coulage du béton',
      confirmPassword: 'Confirmer le mot de passe',
      enterPassword: 'Entrez le mot de passe',
      passwordRequired: 'Le mot de passe est requis',
      wrongPassword: 'Mot de passe incorrect',
      accessProject: 'Accéder au projet',
      cancel: 'Annuler',
      save: 'Enregistrer',
      projectDetails: 'Détails du projet',
      noProjectsFound: 'Aucun projet trouvé',
      buildingTypeOptions: {
        immeuble: 'Immeuble',
        villa: 'Villa',
        bureau: 'Bureau',
        commercial: 'Commercial',
        other: 'Autre',
      },
      blocks: {
        title: 'Blocs',
        addBlock: 'Ajouter un bloc',
        editBlock: 'Modifier le bloc',
        deleteBlock: 'Supprimer le bloc',
        blockName: 'Nom du bloc',
        blockNumber: 'Numéro de bloc',
        noBlocks: 'Aucun bloc',
      },
    },
    floors: {
      title: 'Étages',
      addFloor: 'Ajouter un étage',
      editFloor: 'Modifier l\'étage',
      viewFloor: 'Voir l\'étage',
      deleteFloor: 'Supprimer l\'étage',
      shareFloor: 'Partager l\'étage',
      floorName: 'Nom de l\'étage',
      floorNumber: 'Numéro d\'étage',
      grosOeuvre: 'Gros Œuvre',
      rebarInspectionDate: 'Date de vérification du ferraillage',
      concretePouringDate: 'Date de coulage du béton',
      notes: 'Notes',
      status: 'Statut',
      statuses: {
        notStarted: 'Non commencé',
        inProgress: 'En cours',
        completed: 'Terminé',
      },
      save: 'Enregistrer',
      cancel: 'Annuler',
      noFloors: 'Aucun étage',
      noFloorsForProject: 'Aucun étage pour ce projet',
      cesCet: {
        title: 'Suivi CES/CET',
        ces: 'CES',
        cet: 'CET',
      },
    },
    reports: {
      title: 'Rapports',
      addReport: 'Ajouter un rapport',
      editReport: 'Modifier le rapport',
      viewReport: 'Voir le rapport',
      deleteReport: 'Supprimer le rapport',
      shareReport: 'Partager le rapport',
      reportType: 'Type de rapport',
      date: 'Date',
      description: 'Description',
      linkProject: 'Projet lié',
      types: {
        pvVisite: 'PV de visite',
        pvConstat: 'PV de constat',
        rapport: 'Rapport',
      },
      save: 'Enregistrer',
      cancel: 'Annuler',
      noReports: 'Aucun rapport',
      noReportsForProject: 'Aucun rapport pour ce projet',
    },
    problems: {
      title: 'Problèmes',
      addProblem: 'Ajouter un problème',
      editProblem: 'Modifier le problème',
      viewProblem: 'Voir le problème',
      deleteProblem: 'Supprimer le problème',
      shareProblem: 'Partager le problème',
      problemTitle: 'Titre',
      description: 'Description',
      date: 'Date',
      linkedProject: 'Projet lié',
      status: 'Statut',
      statuses: {
        open: 'Ouvert',
        inProgress: 'En cours',
        resolved: 'Résolu',
      },
      save: 'Enregistrer',
      cancel: 'Annuler',
      noProblems: 'Aucun problème',
      noProblemsForProject: 'Aucun problème pour ce projet',
    },
    settings: {
      title: 'Paramètres',
      language: 'Langue',
      theme: 'Thème',
      dark: 'Sombre',
      light: 'Clair',
    },
    common: {
      view: 'Voir',
      edit: 'Modifier',
      delete: 'Supprimer',
      share: 'Partager',
      cancel: 'Annuler',
      save: 'Enregistrer',
      confirm: 'Confirmer',
      deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
      shareViaWhatsApp: 'Partager via WhatsApp',
      shareViaSystem: 'Partager via le système',
      search: 'Rechercher',
      filter: 'Filtrer',
      all: 'Tous',
      loading: 'Chargement...',
      success: 'Opération réussie',
      error: 'Une erreur s\'est produite',
      actions: 'Actions',
    },
    footer: {
      madeBy: 'Réalisé par',
      copyright: '© 2026',
    },
    navigation: {
      dashboard: 'Tableau de bord',
      projects: 'Projets',
      floors: 'Étages',
      reports: 'Rapports',
      problems: 'Problèmes',
      settings: 'Paramètres',
    },
    cesCet: {
      title: 'Suivi CES/CET',
      ces: 'CES',
      cet: 'CET',
      tracking: 'Suivi',
    },
  },
  en: {
    dashboard: {
      title: 'Dashboard',
      latestProgress: 'Latest Progress',
      progress: 'Progress',
      lastUpdate: 'Last update',
      addProject: 'Add New Project',
      viewProject: 'View Project',
      noProjects: 'No projects yet',
    },
    projects: {
      title: 'Projects',
      addProject: 'Add Project',
      editProject: 'Edit Project',
      viewProject: 'View Project',
      deleteProject: 'Delete Project',
      shareProject: 'Share Project',
      projectName: 'Project Name',
      password: 'Password',
      description: 'Description',
      buildingType: 'Building Type',
      numberOfFloors: 'Number of Floors',
      rebarInspectionDate: 'Rebar Inspection Date',
      concretePouringDate: 'Concrete Pouring Date',
      confirmPassword: 'Confirm Password',
      enterPassword: 'Enter Password',
      passwordRequired: 'Password is required',
      wrongPassword: 'Wrong password',
      accessProject: 'Access Project',
      cancel: 'Cancel',
      save: 'Save',
      projectDetails: 'Project Details',
      noProjectsFound: 'No projects found',
      buildingTypeOptions: {
        immeuble: 'Building',
        villa: 'Villa',
        bureau: 'Office',
        commercial: 'Commercial',
        other: 'Other',
      },
      blocks: {
        title: 'Blocks',
        addBlock: 'Add Block',
        editBlock: 'Edit Block',
        deleteBlock: 'Delete Block',
        blockName: 'Block Name',
        blockNumber: 'Block Number',
        noBlocks: 'No blocks',
      },
    },
    floors: {
      title: 'Floors',
      addFloor: 'Add Floor',
      editFloor: 'Edit Floor',
      viewFloor: 'View Floor',
      deleteFloor: 'Delete Floor',
      shareFloor: 'Share Floor',
      floorName: 'Floor Name',
      floorNumber: 'Floor Number',
      grosOeuvre: 'Gros Œuvre',
      rebarInspectionDate: 'Rebar Inspection Date',
      concretePouringDate: 'Concrete Pouring Date',
      notes: 'Notes',
      status: 'Status',
      statuses: {
        notStarted: 'Not Started',
        inProgress: 'In Progress',
        completed: 'Completed',
      },
      save: 'Save',
      cancel: 'Cancel',
      noFloors: 'No floors',
      noFloorsForProject: 'No floors for this project',
      cesCet: {
        title: 'CES/CET Tracking',
        ces: 'CES',
        cet: 'CET',
      },
    },
    reports: {
      title: 'Reports',
      addReport: 'Add Report',
      editReport: 'Edit Report',
      viewReport: 'View Report',
      deleteReport: 'Delete Report',
      shareReport: 'Share Report',
      reportType: 'Report Type',
      date: 'Date',
      description: 'Description',
      linkProject: 'Linked Project',
      types: {
        pvVisite: 'Visit Report',
        pvConstat: 'Observation Report',
        rapport: 'Report',
      },
      save: 'Save',
      cancel: 'Cancel',
      noReports: 'No reports',
      noReportsForProject: 'No reports for this project',
    },
    problems: {
      title: 'Problems',
      addProblem: 'Add Problem',
      editProblem: 'Edit Problem',
      viewProblem: 'View Problem',
      deleteProblem: 'Delete Problem',
      shareProblem: 'Share Problem',
      problemTitle: 'Title',
      description: 'Description',
      date: 'Date',
      linkedProject: 'Linked Project',
      status: 'Status',
      statuses: {
        open: 'Open',
        inProgress: 'In Progress',
        resolved: 'Resolved',
      },
      save: 'Save',
      cancel: 'Cancel',
      noProblems: 'No problems',
      noProblemsForProject: 'No problems for this project',
    },
    settings: {
      title: 'Settings',
      language: 'Language',
      theme: 'Theme',
      dark: 'Dark',
      light: 'Light',
    },
    common: {
      view: 'View',
      edit: 'Edit',
      delete: 'Delete',
      share: 'Share',
      cancel: 'Cancel',
      save: 'Save',
      confirm: 'Confirm',
      deleteConfirm: 'Are you sure you want to delete this item?',
      shareViaWhatsApp: 'Share via WhatsApp',
      shareViaSystem: 'Share via System',
      search: 'Search',
      filter: 'Filter',
      all: 'All',
      loading: 'Loading...',
      success: 'Operation successful',
      error: 'An error occurred',
      actions: 'Actions',
    },
    footer: {
      madeBy: 'Made by',
      copyright: '© 2026',
    },
    navigation: {
      dashboard: 'Dashboard',
      projects: 'Projects',
      floors: 'Floors',
      reports: 'Reports',
      problems: 'Problems',
      settings: 'Settings',
    },
    cesCet: {
      title: 'CES/CET Tracking',
      ces: 'CES',
      cet: 'CET',
      tracking: 'Tracking',
    },
  },
};

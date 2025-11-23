// Progress tracking service - tracks user learning journey

export interface ModuleProgress {
  moduleId: string;
  moduleName: string;
  completed: boolean;
  completedAt?: number;
  timeSpent: number; // seconds
  quizScore?: number;
  quizAttempts: number;
  lastAccessed: number;
}

export interface LearningStats {
  totalModulesCompleted: number;
  totalTimeSpent: number; // seconds
  averageQuizScore: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  startDate: string;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
  progress?: number; // 0-100
}

const STORAGE_KEY = 'funding_coach_progress';
const STATS_KEY = 'funding_coach_stats';

// Initialize progress tracking
export const initializeProgress = (): void => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({}));
  }
  
  const stats = localStorage.getItem(STATS_KEY);
  if (!stats) {
    const initialStats: LearningStats = {
      totalModulesCompleted: 0,
      totalTimeSpent: 0,
      averageQuizScore: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      achievements: []
    };
    localStorage.setItem(STATS_KEY, JSON.stringify(initialStats));
  }
};

// Get progress for a specific module
export const getModuleProgress = (moduleId: string): ModuleProgress | null => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;
  
  const progress = JSON.parse(data);
  return progress[moduleId] || null;
};

// Update module progress
export const updateModuleProgress = (moduleId: string, moduleName: string, updates: Partial<ModuleProgress>): void => {
  const data = localStorage.getItem(STORAGE_KEY);
  const progress = data ? JSON.parse(data) : {};
  
  const existing = progress[moduleId] || {
    moduleId,
    moduleName,
    completed: false,
    timeSpent: 0,
    quizAttempts: 0,
    lastAccessed: Date.now()
  };
  
  progress[moduleId] = {
    ...existing,
    ...updates,
    lastAccessed: Date.now()
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  
  // Update stats
  updateStats();
  
  // Check for achievements
  checkAchievements();
};

// Mark module as completed
export const completeModule = (moduleId: string, moduleName: string): void => {
  updateModuleProgress(moduleId, moduleName, {
    completed: true,
    completedAt: Date.now()
  });
};

// Record quiz score
export const recordQuizScore = (moduleId: string, moduleName: string, score: number, total: number): void => {
  const existing = getModuleProgress(moduleId);
  const percentage = Math.round((score / total) * 100);
  
  updateModuleProgress(moduleId, moduleName, {
    quizScore: percentage,
    quizAttempts: (existing?.quizAttempts || 0) + 1
  });
};

// Add time spent on module
export const addTimeSpent = (moduleId: string, moduleName: string, seconds: number): void => {
  const existing = getModuleProgress(moduleId);
  updateModuleProgress(moduleId, moduleName, {
    timeSpent: (existing?.timeSpent || 0) + seconds
  });
};

// Get all progress
export const getAllProgress = (): Record<string, ModuleProgress> => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
};

// Get learning stats
export const getLearningStats = (): LearningStats => {
  const data = localStorage.getItem(STATS_KEY);
  if (!data) {
    initializeProgress();
    return getLearningStats();
  }
  return JSON.parse(data);
};

// Update overall stats
const updateStats = (): void => {
  const progress = getAllProgress();
  const stats = getLearningStats();
  
  const modules = Object.values(progress);
  const completedModules = modules.filter(m => m.completed);
  const quizScores = modules.filter(m => m.quizScore !== undefined).map(m => m.quizScore!);
  
  const totalTimeSpent = modules.reduce((sum, m) => sum + m.timeSpent, 0);
  const averageQuizScore = quizScores.length > 0 
    ? Math.round(quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length)
    : 0;
  
  // Update streak
  const today = new Date().toISOString().split('T')[0];
  const lastActive = stats.lastActiveDate;
  
  let currentStreak = stats.currentStreak;
  if (lastActive !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (lastActive === yesterday) {
      currentStreak += 1;
    } else {
      currentStreak = 1;
    }
  }
  
  const updatedStats: LearningStats = {
    ...stats,
    totalModulesCompleted: completedModules.length,
    totalTimeSpent,
    averageQuizScore,
    currentStreak,
    longestStreak: Math.max(stats.longestStreak, currentStreak),
    lastActiveDate: today
  };
  
  localStorage.setItem(STATS_KEY, JSON.stringify(updatedStats));
};

// Check and unlock achievements
const checkAchievements = (): void => {
  const stats = getLearningStats();
  const progress = getAllProgress();
  const achievements: Achievement[] = [...stats.achievements];
  
  const allAchievements: Achievement[] = [
    {
      id: 'first_module',
      name: 'First Steps',
      description: 'Complete your first module',
      icon: '🎯',
    },
    {
      id: 'quiz_master',
      name: 'Quiz Master',
      description: 'Score 100% on any quiz',
      icon: '🏆',
    },
    {
      id: 'week_streak',
      name: '7-Day Streak',
      description: 'Learn for 7 days in a row',
      icon: '🔥',
    },
    {
      id: 'halfway',
      name: 'Halfway There',
      description: 'Complete 15 modules',
      icon: '⭐',
    },
    {
      id: 'graduate',
      name: 'Graduate',
      description: 'Complete all 30 modules',
      icon: '🎓',
    },
    {
      id: 'speed_learner',
      name: 'Speed Learner',
      description: 'Complete 5 modules in one day',
      icon: '⚡',
    },
    {
      id: 'perfect_student',
      name: 'Perfect Student',
      description: 'Score 90%+ on 10 quizzes',
      icon: '💯',
    }
  ];
  
  // Check each achievement
  allAchievements.forEach(achievement => {
    const alreadyUnlocked = achievements.find(a => a.id === achievement.id);
    if (alreadyUnlocked) return;
    
    let unlock = false;
    
    switch (achievement.id) {
      case 'first_module':
        unlock = stats.totalModulesCompleted >= 1;
        break;
      case 'quiz_master':
        unlock = Object.values(progress).some(m => m.quizScore === 100);
        break;
      case 'week_streak':
        unlock = stats.currentStreak >= 7;
        break;
      case 'halfway':
        unlock = stats.totalModulesCompleted >= 15;
        break;
      case 'graduate':
        unlock = stats.totalModulesCompleted >= 30;
        break;
      case 'speed_learner':
        const today = new Date().toISOString().split('T')[0];
        const todayCompletions = Object.values(progress).filter(m => {
          if (!m.completedAt) return false;
          const completedDate = new Date(m.completedAt).toISOString().split('T')[0];
          return completedDate === today;
        });
        unlock = todayCompletions.length >= 5;
        break;
      case 'perfect_student':
        const highScores = Object.values(progress).filter(m => m.quizScore && m.quizScore >= 90);
        unlock = highScores.length >= 10;
        break;
    }
    
    if (unlock) {
      achievements.push({
        ...achievement,
        unlockedAt: Date.now()
      });
    }
  });
  
  // Update stats with new achievements
  const updatedStats = { ...stats, achievements };
  localStorage.setItem(STATS_KEY, JSON.stringify(updatedStats));
};

// Get completion percentage
export const getCompletionPercentage = (): number => {
  const progress = getAllProgress();
  const completed = Object.values(progress).filter(m => m.completed).length;
  return Math.round((completed / 30) * 100);
};

// Format time spent
export const formatTimeSpent = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

// Reset all progress (for testing)
export const resetProgress = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STATS_KEY);
  initializeProgress();
};

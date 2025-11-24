
export enum AppMode {
  TEACH = 'TEACH',
  QUIZ = 'QUIZ',
  APPLY = 'APPLY',
  FLASHCARDS = 'FLASHCARDS',
  MOCK_INTERVIEW = 'MOCK_INTERVIEW',
  PLAN = '90_DAY_PLAN',
  GLOSSARY = 'GLOSSARY',
  VC_FINDER = 'VC_FINDER',
  PROGRESS = 'PROGRESS',
  VC_PIPELINE = 'VC_PIPELINE'
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface StartupContext {
  name: string;
  pitch: string;
  stage: string;
  roundSize: string;
  traction: string;
  team: string;
  problem: string;
  solution: string;
  market: string;
  businessModel: string;
  competitors: string;
  useOfFunds: string;
  description?: string; // Optional for backward compatibility
}

export interface PlanItem {
  week: string;
  focus: string;
  tasks: string[];
}

export interface RoadmapWeek {
  weekNumber: number;
  theme: string;
  tasks: string[];
}

export interface RoadmapMonth {
  monthNumber: number;
  title: string;
  focus: string;
  weeks: RoadmapWeek[];
}

export type VisualType = 'PROCESS' | 'COMPARISON' | 'STATISTIC' | 'NONE';

export interface VisualData {
  // For PROCESS
  steps?: string[];

  // For COMPARISON
  leftTitle?: string;
  rightTitle?: string;
  items?: { left: string; right: string }[];

  // For STATISTIC
  statValue?: string;
  statLabel?: string;
  statContext?: string;
}

export interface Slide {
  title: string;
  bullets: string[];
  tutorNotes: string;
  detailedExplanation?: string; // New: In-depth curriculum content
  practicalExample?: string;    // New: Specific application to user's startup
  visualType: VisualType;
  visualData?: VisualData;
}

export interface SlideDeck {
  moduleTitle: string;
  slides: Slide[];
}

export enum PodcastStatus {
  IDLE = 'IDLE',
  GENERATING_SCRIPT = 'GENERATING_SCRIPT',
  GENERATING_AUDIO = 'GENERATING_AUDIO',
  READY = 'READY',
  PLAYING = 'PLAYING',
  ERROR = 'ERROR'
}

export interface PodcastState {
  status: PodcastStatus;
  script?: string;
  audioBuffer?: AudioBuffer;
  error?: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: 'General' | 'Financial' | 'Legal' | 'Metrics' | 'Funding';
}

export interface VCContact {
  name: string;
  role: string;
  email: string;
  linkedin?: string;
}

export interface VCProfile {
  name: string;
  firmType: 'Micro-VC' | 'VC' | 'Angel Network' | 'Accelerator' | 'Family Office';
  checkSize?: string;
  thesis?: string;
  notablePortfolio?: string[];
  matchReason?: string;
  email?: string;
  website?: string;
  linkedin?: string;
  detailedInfo?: string; // Comprehensive information about the VC
  contacts?: VCContact[]; // Multiple partners
}

export interface VCInsights {
  trends: string[];
  investors: VCProfile[];
}

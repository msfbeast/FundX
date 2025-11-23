// VC Pipeline Management - Track investor outreach

export type PipelineStatus = 'to_contact' | 'contacted' | 'in_discussion' | 'passed' | 'closed_won';

export interface VCPipelineItem {
  id: string;
  vcName: string;
  firmType: string;
  checkSize: string;
  thesis: string;
  email: string;
  website?: string;
  linkedin?: string;
  status: PipelineStatus;
  notes: string;
  tags: string[];
  contactedAt?: number;
  lastFollowUp?: number;
  nextFollowUp?: number;
  addedAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'vc_pipeline';

// Validation helpers
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const validateVCData = (vc: Partial<VCPipelineItem>): string[] => {
  const errors: string[] = [];
  
  if (!vc.vcName || vc.vcName.trim().length === 0) {
    errors.push('VC name is required');
  }
  
  if (!vc.email || !isValidEmail(vc.email)) {
    errors.push('Valid email is required');
  }
  
  if (vc.website && !isValidUrl(vc.website)) {
    errors.push('Website must be a valid URL');
  }
  
  if (vc.linkedin && !isValidUrl(vc.linkedin)) {
    errors.push('LinkedIn must be a valid URL');
  }
  
  if (!vc.firmType || vc.firmType.trim().length === 0) {
    errors.push('Firm type is required');
  }
  
  if (!vc.checkSize || vc.checkSize.trim().length === 0) {
    errors.push('Check size is required');
  }
  
  return errors;
};

// Initialize pipeline
export const initializePipeline = (): void => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
};

// Get all VCs in pipeline
export const getAllVCs = (): VCPipelineItem[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Get VCs by status
export const getVCsByStatus = (status: PipelineStatus): VCPipelineItem[] => {
  return getAllVCs().filter(vc => vc.status === status);
};

// Add VC to pipeline
export const addVCToPipeline = (vc: Omit<VCPipelineItem, 'id' | 'addedAt' | 'updatedAt'>): VCPipelineItem => {
  // Validate input
  const errors = validateVCData(vc);
  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(', ')}`);
  }
  
  const vcs = getAllVCs();
  
  // Check if VC already exists (case-insensitive, trimmed)
  const normalizedName = vc.vcName.trim().toLowerCase();
  const existing = vcs.find(v => v.vcName.trim().toLowerCase() === normalizedName);
  if (existing) {
    return existing;
  }
  
  const newVC: VCPipelineItem = {
    ...vc,
    vcName: vc.vcName.trim(),
    email: vc.email.trim().toLowerCase(),
    firmType: vc.firmType.trim(),
    checkSize: vc.checkSize.trim(),
    thesis: vc.thesis.trim(),
    notes: vc.notes.trim(),
    id: `vc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    addedAt: Date.now(),
    updatedAt: Date.now()
  };
  
  vcs.push(newVC);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vcs));
  
  return newVC;
};

// Update VC status
export const updateVCStatus = (id: string, status: PipelineStatus): void => {
  const vcs = getAllVCs();
  const index = vcs.findIndex(vc => vc.id === id);
  
  if (index !== -1) {
    vcs[index].status = status;
    vcs[index].updatedAt = Date.now();
    
    if (status === 'contacted' && !vcs[index].contactedAt) {
      vcs[index].contactedAt = Date.now();
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vcs));
  }
};

// Update VC notes
export const updateVCNotes = (id: string, notes: string): void => {
  const vcs = getAllVCs();
  const index = vcs.findIndex(vc => vc.id === id);
  
  if (index !== -1) {
    vcs[index].notes = notes;
    vcs[index].updatedAt = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vcs));
  }
};

// Add tag to VC
export const addVCTag = (id: string, tag: string): void => {
  const vcs = getAllVCs();
  const index = vcs.findIndex(vc => vc.id === id);
  
  if (index !== -1 && !vcs[index].tags.includes(tag)) {
    vcs[index].tags.push(tag);
    vcs[index].updatedAt = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vcs));
  }
};

// Remove tag from VC
export const removeVCTag = (id: string, tag: string): void => {
  const vcs = getAllVCs();
  const index = vcs.findIndex(vc => vc.id === id);
  
  if (index !== -1) {
    vcs[index].tags = vcs[index].tags.filter(t => t !== tag);
    vcs[index].updatedAt = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vcs));
  }
};

// Set follow-up date
export const setFollowUpDate = (id: string, date: number): void => {
  const vcs = getAllVCs();
  const index = vcs.findIndex(vc => vc.id === id);
  
  if (index !== -1) {
    vcs[index].nextFollowUp = date;
    vcs[index].updatedAt = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vcs));
  }
};

// Record follow-up
export const recordFollowUp = (id: string): void => {
  const vcs = getAllVCs();
  const index = vcs.findIndex(vc => vc.id === id);
  
  if (index !== -1) {
    vcs[index].lastFollowUp = Date.now();
    vcs[index].nextFollowUp = undefined;
    vcs[index].updatedAt = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vcs));
  }
};

// Delete VC from pipeline
export const deleteVC = (id: string): void => {
  const vcs = getAllVCs();
  const filtered = vcs.filter(vc => vc.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

// Get pipeline stats
export const getPipelineStats = () => {
  const vcs = getAllVCs();
  
  return {
    total: vcs.length,
    toContact: vcs.filter(v => v.status === 'to_contact').length,
    contacted: vcs.filter(v => v.status === 'contacted').length,
    inDiscussion: vcs.filter(v => v.status === 'in_discussion').length,
    passed: vcs.filter(v => v.status === 'passed').length,
    closedWon: vcs.filter(v => v.status === 'closed_won').length,
    responseRate: vcs.filter(v => v.contactedAt).length > 0 
      ? Math.round((vcs.filter(v => v.status === 'in_discussion' || v.status === 'closed_won').length / vcs.filter(v => v.contactedAt).length) * 100)
      : 0
  };
};

// Get VCs needing follow-up
export const getVCsNeedingFollowUp = (): VCPipelineItem[] => {
  const now = Date.now();
  return getAllVCs().filter(vc => 
    vc.nextFollowUp && vc.nextFollowUp <= now
  );
};

// Export pipeline to CSV
export const exportPipelineToCSV = (): string => {
  const vcs = getAllVCs();
  
  const headers = ['VC Name', 'Firm Type', 'Check Size', 'Status', 'Email', 'Website', 'Notes', 'Tags', 'Added Date'];
  const rows = vcs.map(vc => [
    vc.vcName,
    vc.firmType,
    vc.checkSize,
    vc.status,
    vc.email,
    vc.website || '',
    vc.notes.replace(/,/g, ';'), // Escape commas
    vc.tags.join(';'),
    new Date(vc.addedAt).toLocaleDateString()
  ]);
  
  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
  
  return csv;
};

// Download CSV
export const downloadPipelineCSV = (): void => {
  const csv = exportPipelineToCSV();
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vc-pipeline-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

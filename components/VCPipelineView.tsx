import React, { useState, useEffect } from 'react';
import {
  Building2, Mail, Globe, Linkedin, Plus, X, Calendar,
  Download, TrendingUp, MessageSquare, CheckCircle, XCircle,
  Clock, Tag, StickyNote, ExternalLink
} from 'lucide-react';
import {
  getAllVCs,
  getVCsByStatus,
  updateVCStatus,
  updateVCNotes,
  addVCTag,
  removeVCTag,
  setFollowUpDate,
  deleteVC,
  getPipelineStats,
  downloadPipelineCSV,
  type VCPipelineItem,
  type PipelineStatus
} from '../services/vcPipeline';
import { useToast } from './Toast';

const PIPELINE_COLUMNS: { status: PipelineStatus; label: string; color: string; icon: React.ReactNode }[] = [
  { status: 'to_contact', label: 'To Contact', color: 'slate', icon: <Mail className="w-4 h-4" /> },
  { status: 'contacted', label: 'Contacted', color: 'blue', icon: <MessageSquare className="w-4 h-4" /> },
  { status: 'in_discussion', label: 'In Discussion', color: 'purple', icon: <TrendingUp className="w-4 h-4" /> },
  { status: 'passed', label: 'Passed', color: 'rose', icon: <XCircle className="w-4 h-4" /> },
  { status: 'closed_won', label: 'Closed Won', color: 'emerald', icon: <CheckCircle className="w-4 h-4" /> },
];

export const VCPipelineView: React.FC = () => {
  const [vcs, setVCs] = useState<VCPipelineItem[]>([]);
  const [selectedVC, setSelectedVC] = useState<VCPipelineItem | null>(null);
  const [stats, setStats] = useState(getPipelineStats());
  const { success } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setVCs(getAllVCs());
    setStats(getPipelineStats());
  };

  const handleStatusChange = (vcId: string, newStatus: PipelineStatus) => {
    updateVCStatus(vcId, newStatus);
    loadData();
    success(`VC moved to ${PIPELINE_COLUMNS.find(c => c.status === newStatus)?.label}!`);
  };

  const handleDelete = (vcId: string) => {
    if (confirm('Remove this VC from your pipeline?')) {
      deleteVC(vcId);
      loadData();
      setSelectedVC(null);
      success('VC removed from pipeline');
    }
  };

  const handleExport = () => {
    downloadPipelineCSV();
    success('Pipeline exported to CSV!');
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      
      {/* Header */}
      <div className="shrink-0 p-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">VC Pipeline</h1>
              <p className="text-slate-500">Track your investor outreach</p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-black font-medium text-sm transition-all"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <StatCard label="Total" value={stats.total} color="slate" />
            <StatCard label="To Contact" value={stats.toContact} color="slate" />
            <StatCard label="Contacted" value={stats.contacted} color="blue" />
            <StatCard label="In Discussion" value={stats.inDiscussion} color="purple" />
            <StatCard label="Closed Won" value={stats.closedWon} color="emerald" />
            <StatCard label="Response Rate" value={`${stats.responseRate}%`} color="indigo" />
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <div className="max-w-7xl mx-auto h-full">
          <div className="flex gap-4 h-full">
            {PIPELINE_COLUMNS.map((column) => (
              <KanbanColumn
                key={column.status}
                column={column}
                vcs={getVCsByStatus(column.status)}
                onStatusChange={handleStatusChange}
                onSelectVC={setSelectedVC}
              />
            ))}
          </div>
        </div>
      </div>

      {/* VC Detail Modal */}
      {selectedVC && (
        <VCDetailModal
          vc={selectedVC}
          onClose={() => setSelectedVC(null)}
          onUpdate={loadData}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

// Stat Card
const StatCard: React.FC<{ label: string; value: number | string; color: string }> = ({ label, value, color }) => {
  const colorClasses: Record<string, string> = {
    slate: 'bg-slate-50 text-slate-700 border-slate-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };

  return (
    <div className={`p-3 rounded-xl border ${colorClasses[color]}`}>
      <div className="text-xs font-medium opacity-75 mb-1">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
};

// Kanban Column
const KanbanColumn: React.FC<{
  column: typeof PIPELINE_COLUMNS[0];
  vcs: VCPipelineItem[];
  onStatusChange: (vcId: string, status: PipelineStatus) => void;
  onSelectVC: (vc: VCPipelineItem) => void;
}> = ({ column, vcs, onStatusChange, onSelectVC }) => {
  const colorClasses: Record<string, string> = {
    slate: 'bg-slate-100 border-slate-200',
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200',
    rose: 'bg-rose-50 border-rose-200',
    emerald: 'bg-emerald-50 border-emerald-200',
  };

  return (
    <div className="flex-1 min-w-[280px] flex flex-col">
      <div className={`p-3 rounded-t-2xl border-2 ${colorClasses[column.color]}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {column.icon}
            <span className="font-bold text-sm">{column.label}</span>
          </div>
          <span className="px-2 py-0.5 bg-white rounded-full text-xs font-bold">
            {vcs.length}
          </span>
        </div>
      </div>
      
      <div className="flex-1 bg-white border-2 border-t-0 rounded-b-2xl p-3 overflow-y-auto space-y-2">
        {vcs.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            No VCs in this stage
          </div>
        ) : (
          vcs.map((vc) => (
            <VCCard
              key={vc.id}
              vc={vc}
              onSelect={() => onSelectVC(vc)}
            />
          ))
        )}
      </div>
    </div>
  );
};

// VC Card
const VCCard: React.FC<{
  vc: VCPipelineItem;
  onSelect: () => void;
}> = ({ vc, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="font-bold text-sm text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
        {vc.vcName}
      </div>
      <div className="text-xs text-slate-500 mb-2">{vc.firmType} • {vc.checkSize}</div>
      
      {vc.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {vc.tags.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-md">
              {tag}
            </span>
          ))}
          {vc.tags.length > 2 && (
            <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-bold rounded-md">
              +{vc.tags.length - 2}
            </span>
          )}
        </div>
      )}
      
      {vc.nextFollowUp && (
        <div className="flex items-center gap-1 text-[10px] text-orange-600 font-medium">
          <Clock className="w-3 h-3" />
          Follow up: {new Date(vc.nextFollowUp).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

// VC Detail Modal
const VCDetailModal: React.FC<{
  vc: VCPipelineItem;
  onClose: () => void;
  onUpdate: () => void;
  onDelete: (id: string) => void;
  onStatusChange: (vcId: string, status: PipelineStatus) => void;
}> = ({ vc, onClose, onUpdate, onDelete, onStatusChange }) => {
  const [notes, setNotes] = useState(vc.notes);
  const [newTag, setNewTag] = useState('');

  const handleSaveNotes = () => {
    updateVCNotes(vc.id, notes);
    onUpdate();
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      addVCTag(vc.id, newTag.trim());
      setNewTag('');
      onUpdate();
    }
  };

  const handleRemoveTag = (tag: string) => {
    removeVCTag(vc.id, tag);
    onUpdate();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">{vc.vcName}</h2>
              <p className="text-sm text-slate-500">{vc.firmType} • {vc.checkSize}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Status */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Status</label>
            <select
              value={vc.status}
              onChange={(e) => onStatusChange(vc.id, e.target.value as PipelineStatus)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {PIPELINE_COLUMNS.map((col) => (
                <option key={col.status} value={col.status}>{col.label}</option>
              ))}
            </select>
          </div>

          {/* Contact Info */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contact</label>
            <div className="space-y-2">
              {vc.email && (
                <a href={`mailto:${vc.email}`} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">{vc.email}</span>
                </a>
              )}
              {vc.website && (
                <a href={vc.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">Website</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 ml-auto" />
                </a>
              )}
              {vc.linkedin && (
                <a href={vc.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <Linkedin className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">LinkedIn</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 ml-auto" />
                </a>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {vc.tags.map((tag, idx) => (
                <span key={idx} className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg">
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="hover:bg-blue-200 rounded p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add tag..."
                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button onClick={handleAddTag} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium text-sm">
                Add
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleSaveNotes}
              placeholder="Add notes about this VC..."
              rows={6}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-between">
          <button
            onClick={() => onDelete(vc.id)}
            className="px-4 py-2 bg-rose-100 text-rose-700 rounded-xl hover:bg-rose-200 font-medium text-sm"
          >
            Remove from Pipeline
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 text-white rounded-xl hover:bg-black font-medium text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

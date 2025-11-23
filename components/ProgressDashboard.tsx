import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { 
  Trophy, Target, Clock, TrendingUp, Award, Flame, 
  CheckCircle, BarChart3, Calendar, Zap 
} from 'lucide-react';
import { 
  getLearningStats, 
  getAllProgress, 
  getCompletionPercentage,
  formatTimeSpent,
  type LearningStats,
  type ModuleProgress 
} from '../services/progressTracking';
import { MODULES } from '../constants';

export const ProgressDashboard: React.FC = () => {
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [progress, setProgress] = useState<Record<string, ModuleProgress>>({});
  const [completionPercentage, setCompletionPercentage] = useState(0);

  const loadData = useCallback(() => {
    setStats(getLearningStats());
    setProgress(getAllProgress());
    setCompletionPercentage(getCompletionPercentage());
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Memoize expensive computations
  const recentModules = useMemo(() => {
    return (Object.values(progress) as ModuleProgress[])
      .sort((a, b) => b.lastAccessed - a.lastAccessed)
      .slice(0, 5);
  }, [progress]);

  if (!stats) return null;

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Progress</h1>
            <p className="text-slate-500">Track your fundraising mastery journey</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-blue-600">{completionPercentage}%</div>
            <div className="text-sm text-slate-500">Complete</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Modules Completed */}
          <StatCard
            icon={<CheckCircle className="w-6 h-6" />}
            label="Modules Completed"
            value={`${stats.totalModulesCompleted}/30`}
            color="blue"
          />

          {/* Time Spent */}
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            label="Time Spent Learning"
            value={formatTimeSpent(stats.totalTimeSpent)}
            color="indigo"
          />

          {/* Average Quiz Score */}
          <StatCard
            icon={<Target className="w-6 h-6" />}
            label="Avg Quiz Score"
            value={`${stats.averageQuizScore}%`}
            color="emerald"
          />

          {/* Current Streak */}
          <StatCard
            icon={<Flame className="w-6 h-6" />}
            label="Current Streak"
            value={`${stats.currentStreak} days`}
            color="orange"
          />
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Overall Progress</h3>
            <span className="text-sm text-slate-500">{stats.totalModulesCompleted} of 30 modules</span>
          </div>
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Achievements */}
        {stats.achievements.length > 0 && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-6 h-6 text-yellow-600" />
              <h3 className="text-lg font-bold text-slate-900">Achievements</h3>
              <span className="px-2 py-1 bg-yellow-50 text-yellow-600 text-xs font-bold rounded-full">
                {stats.achievements.length}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {stats.achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className="flex flex-col items-center text-center p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border border-yellow-100"
                >
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <div className="font-bold text-sm text-slate-900 mb-1">{achievement.name}</div>
                  <div className="text-xs text-slate-500">{achievement.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
          </div>
          {recentModules.length > 0 ? (
            <div className="space-y-3">
              {recentModules.map((module) => (
                <div 
                  key={module.moduleId}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {module.completed ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                    )}
                    <div>
                      <div className="font-medium text-slate-900">{module.moduleName}</div>
                      <div className="text-xs text-slate-500">
                        {formatTimeSpent(module.timeSpent)} spent
                        {module.quizScore !== undefined && ` • Quiz: ${module.quizScore}%`}
                      </div>
                    </div>
                  </div>
                  {module.completed && (
                    <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full">
                      Completed
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Start learning to see your activity here!</p>
            </div>
          )}
        </div>

        {/* Module Breakdown */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">Module Breakdown</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {MODULES.map((moduleName, index) => {
              const moduleId = `module_${index + 1}`;
              const moduleProgress = progress[moduleId] as ModuleProgress | undefined;
              const isCompleted = moduleProgress?.completed || false;
              const quizScore = moduleProgress?.quizScore;
              
              return (
                <div 
                  key={moduleId}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isCompleted 
                      ? 'bg-emerald-50 border-emerald-200' 
                      : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                    )}
                    <span className="text-sm font-medium text-slate-700">{moduleName}</span>
                  </div>
                  {quizScore !== undefined && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                      quizScore >= 80 
                        ? 'bg-emerald-100 text-emerald-700'
                        : quizScore >= 60
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}>
                      {quizScore}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

// Stat Card Component
const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'blue' | 'indigo' | 'emerald' | 'orange';
}> = ({ icon, label, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100'
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClasses[color]}`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
};

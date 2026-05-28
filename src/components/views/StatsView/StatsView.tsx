import { useEffect, useState } from 'react';
import { cloudApi } from '../../../api';
import { useAuthStore } from '../../../store/authStore';
import { Users, UserPlus, CheckSquare, LayoutDashboard, Calendar, LayoutGrid, CalendarDays, Tags, ArrowLeft } from 'lucide-react';

export function StatsView() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    if (user?.email !== 'sanbai@qq.com') {
      window.location.href = window.location.pathname; // Redirect if not whitelist
      return;
    }

    const fetchStats = async () => {
      const data = await cloudApi.getStats();
      if (data) {
        setStats(data);
      }
      setLoading(false);
    };
    fetchStats();
  }, [user]);

  if (user?.email !== 'sanbai@qq.com') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--ink-1)]">
        <div className="animate-pulse">正在加载数据统计...</div>
      </div>
    );
  }

  const statCards = [
    { label: '累计注册用户数', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-500' },
    { label: '累计有待办用户数', value: stats?.totalUsersWithTodo || 0, icon: CheckSquare, color: 'text-indigo-500' },
    { label: '今日注册用户数', value: stats?.todayRegistered || 0, icon: UserPlus, color: 'text-emerald-500' },
    { label: '今日登录用户数', value: stats?.todayLogin || 0, icon: Users, color: 'text-teal-500' },
    { label: '今日新建待办用户数', value: stats?.todayTodoCreate || 0, icon: CheckSquare, color: 'text-cyan-500' },
  ];

  const viewCards = [
    { label: '今日打开每日待办', value: stats?.todayViewTimeline || 0, icon: LayoutDashboard, color: 'text-orange-500' },
    { label: '今日打开状态看板', value: stats?.todayViewStatus || 0, icon: LayoutDashboard, color: 'text-amber-500' },
    { label: '今日打开日历视图', value: stats?.todayViewCalendar || 0, icon: Calendar, color: 'text-rose-500' },
    { label: '今日打开四象限', value: stats?.todayViewQuadrant || 0, icon: LayoutGrid, color: 'text-pink-500' },
    { label: '今日打开月度规划', value: stats?.todayViewMonthPlan || 0, icon: CalendarDays, color: 'text-fuchsia-500' },
    { label: '今日打开标签管理', value: stats?.todayViewTagModal || 0, icon: Tags, color: 'text-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => window.close()} 
            className="p-2 hover:bg-[var(--surface-2)] rounded-lg transition-colors text-[var(--ink-2)]"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-[var(--ink-1)]">数据统计 (Admin)</h1>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-[var(--ink-2)] mb-4">核心指标</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {statCards.map((stat, i) => (
                <div key={i} className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--line-soft)] shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-[var(--ink-3)]">{stat.label}</span>
                    <stat.icon size={18} className={stat.color} />
                  </div>
                  <div className="text-3xl font-bold text-[var(--ink-1)]">{stat.value}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--ink-2)] mb-4">今日视图活跃用户</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {viewCards.map((stat, i) => (
                <div key={i} className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--line-soft)] shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-[var(--ink-3)]">{stat.label}</span>
                    <stat.icon size={18} className={stat.color} />
                  </div>
                  <div className="text-3xl font-bold text-[var(--ink-1)]">{stat.value}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

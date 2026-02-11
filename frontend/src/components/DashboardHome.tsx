import { useState, useEffect } from 'react';
import { Users, UserCheck, Activity, AlertCircle, TrendingUp, Clock } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from 'recharts';
import { useOrg } from '../contexts/OrgContext';

export function DashboardHome() {
    const { departments } = useOrg();
    const [stats, setStats] = useState({
        totalEmployees: 48,
        attendanceToday: 32,
        activeAdmins: 3,
        systemAlerts: 0
    });

    // Mock data for charts
    const distributionData = [
        { name: 'Urgencias', value: 15, color: '#8b5cf6' },
        { name: 'UCI', value: 8, color: '#a78bfa' },
        { name: 'Pediatría', value: 12, color: '#c4b5fd' },
        { name: 'Otros', value: 13, color: '#ddd6fe' },
    ];

    const weeklyAttendance = [
        { day: 'Lun', count: 42 },
        { day: 'Mar', count: 38 },
        { day: 'Mie', count: 45 },
        { day: 'Jue', count: 40 },
        { day: 'Vie', count: 48 },
        { day: 'Sab', count: 20 },
        { day: 'Dom', count: 15 },
    ];

    const recentActivity = [
        { id: 1, name: 'Dr. Alejandro Soto', dept: 'Urgencias', time: '10:24 AM', action: 'Entrada' },
        { id: 2, name: 'Enf. María Garcia', dept: 'UCI', time: '10:15 AM', action: 'Entrada' },
        { id: 3, name: 'Admin. Roberto Luz', dept: 'Administración', time: '09:45 AM', action: 'Salida' },
        { id: 4, name: 'Dr. Elena Paz', dept: 'Pediatría', time: '09:30 AM', action: 'Entrada' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Summary Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <SummaryCard
                    title="Total Personal"
                    value={stats.totalEmployees}
                    icon={Users}
                    trend="+4 este mes"
                    color="var(--primary)"
                />
                <SummaryCard
                    title="Asistencias Hoy"
                    value={stats.attendanceToday}
                    icon={UserCheck}
                    trend="85% del total"
                    color="#10b981"
                />
                <SummaryCard
                    title="Dept. Activos"
                    value={departments.length}
                    icon={Activity}
                    trend="Operativos"
                    color="#3b82f6"
                />
                <SummaryCard
                    title="Alertas Sistema"
                    value={stats.systemAlerts}
                    icon={AlertCircle}
                    trend="Todo normal"
                    color={stats.systemAlerts > 0 ? '#ef4444' : '#6b7280'}
                />
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Chart - Weekly Activity */}
                <div className="lg:col-span-2 bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)] shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-[var(--foreground)]">Asistencia Semanal</h3>
                            <p className="text-sm text-[var(--foreground-secondary)]">Actividad registrada en los últimos 7 días</p>
                        </div>
                        <div className="p-2 bg-[var(--secondary)] rounded-lg text-[var(--primary)]">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyAttendance}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--foreground-secondary)', fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--foreground-secondary)', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'var(--secondary)' }}
                                    contentStyle={{
                                        backgroundColor: 'var(--card)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '12px',
                                        color: 'var(--foreground)'
                                    }}
                                />
                                <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Distribution Chart */}
                <div className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)] shadow-sm">
                    <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">Distribución</h3>
                    <p className="text-sm text-[var(--foreground-secondary)] mb-6">Personal por departamento</p>
                    <div className="h-[200px] w-full mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={distributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {distributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                        {distributionData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-sm text-[var(--foreground-secondary)]">{item.name}</span>
                                </div>
                                <span className="text-sm font-medium text-[var(--foreground)]">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Live Activity Feed */}
                <div className="lg:col-span-3 bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)] shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Clock size={20} className="text-[var(--primary)]" />
                            <h3 className="text-lg font-semibold text-[var(--foreground)]">Actividad Reciente</h3>
                        </div>
                        <button className="text-sm text-[var(--primary)] font-medium hover:underline">Ver todo</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="p-4 bg-[var(--secondary)] rounded-xl border border-[var(--border)] group hover:border-[var(--primary)] transition-all">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                        {activity.name.charAt(0)}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-semibold text-[var(--foreground)] text-sm truncate">{activity.name}</p>
                                        <p className="text-xs text-[var(--foreground-secondary)]">{activity.dept}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${activity.action === 'Entrada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {activity.action}
                                    </span>
                                    <span className="text-xs text-[var(--foreground-secondary)]">{activity.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

function SummaryCard({ title, value, icon: Icon, trend, color }: any) {
    return (
        <div className="bg-[var(--card)] p-5 sm:p-6 rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-[var(--secondary)] opacity-20 -mr-8 -mt-8 rounded-full transition-transform group-hover:scale-110"></div>

            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-sm font-medium text-[var(--foreground-secondary)] mb-1">{title}</p>
                    <p className="text-3xl font-bold text-[var(--foreground)] tracking-tight">{value}</p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--secondary)] text-[var(--foreground)] group-hover:bg-[var(--primary)] group-hover:text-white transition-colors" style={{ color: color }}>
                    <Icon size={24} />
                </div>
            </div>

            <div className="mt-4 flex items-center gap-1.5 relative z-10">
                <span className="text-xs font-medium" style={{ color: color }}>{trend}</span>
            </div>
        </div>
    );
}

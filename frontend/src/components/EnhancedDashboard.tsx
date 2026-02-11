import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Scan, Users, FileText, Settings, Menu, X, ChevronLeft, LogOut, CheckCircle2, LayoutDashboard, Building2 } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { ScannerView } from './ScannerView';
import { StaffManagement } from './StaffManagement';
import { SettingsPanel } from './SettingsPanel';
import { DashboardHome } from './DashboardHome';
import { useAuth } from '../contexts/AuthContext';

interface EnhancedDashboardProps {
  onNavigateToLanding?: () => void;
}

export function EnhancedDashboard({ onNavigateToLanding }: EnhancedDashboardProps) {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [logs, setLogs] = useState<any[]>([]);

  // --- EDUCATIONAL COMMENT: Lista de Dependencias (useEffect) ---
  // useEffect se usa para ejecutar código cuando algo cambia.
  // Aquí, cada vez que cambia 'activeTab' (el usuario cambia de pestaña),
  // verificamos si es la pestaña 'logs' y traemos los datos del backend.
  useEffect(() => {
    if (activeTab === 'logs') {
      api.getAttendance()
        // .then() maneja la promesa resuelta (éxito)
        .then(data => setLogs(data))
        // .catch() maneja cualquier error
        .catch(err => console.error("Failed to fetch logs:", err));
    }
  }, [activeTab]); // [activeTab] es la lista de dependencias



  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', description: 'Vista general y KPIs' },
    { id: 'scanner', icon: Scan, label: 'Scanner AI', description: 'Control de acceso' },
    { id: 'staff', icon: Users, label: 'Personal', description: 'Gestión de empleados' },
    { id: 'departments', icon: Building2, label: 'Áreas', description: 'Configuración de departamentos' },
    { id: 'logs', icon: FileText, label: 'Historial', description: 'Logs detallados' },
    { id: 'settings', icon: Settings, label: 'Ajustes', description: 'Configuración técnica' },
  ];


  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };


  return (
    <div className="h-screen flex flex-col md:flex-row bg-[var(--background-secondary)] transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-[var(--card)] border-r border-[var(--border)] transition-all duration-300 ${sidebarOpen ? 'w-64 lg:w-72' : 'w-20'
          }`}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-[var(--border)]">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center shadow-lg shadow-[var(--primary)]/20">
                <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2L15 6V12L9 16L3 12V6L9 2Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <span className="text-lg font-semibold text-[var(--foreground)] block">MediScan AI</span>
                <span className="text-xs text-[var(--foreground-secondary)]">Dashboard</span>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors p-2 rounded-lg hover:bg-[var(--secondary)]"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                  ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20'
                  : 'text-[var(--foreground-secondary)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]'
                  }`}
                title={!sidebarOpen ? item.label : ''}
              >
                <Icon size={20} />
                {sidebarOpen && (
                  <div className="flex-1 text-left">
                    <span className="font-medium block">{item.label}</span>
                    <span className={`text-xs ${isActive ? 'text-white/80' : 'text-[var(--foreground-secondary)]'}`}>
                      {item.description}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[var(--border)] space-y-2">
          {sidebarOpen && (
            <>
              <div className="px-4 py-3 bg-[var(--secondary)] rounded-xl">
                <p className="text-xs text-[var(--foreground-secondary)] mb-1">Sesión iniciada como</p>
                <p className="font-medium text-[var(--foreground)] text-sm truncate">
                  {user?.email || 'Usuario'}
                </p>
              </div>
              <button
                onClick={async () => {
                  await signOut();
                  onNavigateToLanding?.();
                }}
                className="w-full px-4 py-3 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] rounded-xl transition-all text-left flex items-center gap-3"
              >
                <LogOut size={18} />
                <span>Cerrar sesión</span>
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-[var(--card)] border-b border-[var(--border)] h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[var(--primary)] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L15 6V12L9 16L3 12V6L9 2Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="font-semibold text-[var(--foreground)]">MediScan AI</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[var(--foreground)] p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-[var(--card)] w-80 h-full p-4 space-y-2 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                    ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20'
                    : 'text-[var(--foreground-secondary)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]'
                    }`}
                >
                  <Icon size={20} />
                  <div className="flex-1 text-left">
                    <span className="font-medium block">{item.label}</span>
                    <span className={`text-xs ${isActive ? 'text-white/80' : 'text-[var(--foreground-secondary)]'}`}>
                      {item.description}
                    </span>
                  </div>
                </button>
              );
            })}
            <div className="absolute bottom-4 left-4 right-4">
              <button
                onClick={async () => {
                  await signOut();
                  onNavigateToLanding?.();
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-[var(--foreground-secondary)] hover:bg-[var(--secondary)] rounded-xl transition-colors"
              >
                <LogOut size={20} />
                <span className="font-medium">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Content Header */}
        <div className="bg-[var(--card)] border-b border-[var(--border)] px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-[var(--foreground)] capitalize">{activeTab}</h1>
            <p className="text-sm text-[var(--foreground-secondary)] mt-0.5">
              {menuItems.find(item => item.id === activeTab)?.description}
            </p>
          </div>
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <DashboardHome />}
            {activeTab === 'scanner' && <ScannerView />}
            {activeTab === 'staff' && <StaffManagement />}
            {activeTab === 'departments' && (
              <div className="flex flex-col items-center justify-center h-[60vh] text-[var(--foreground-secondary)]">
                <Building2 size={48} className="mb-4 opacity-20" />
                <h2 className="text-xl font-medium">Gestión de Áreas</h2>
                <p>Próximamente: Configura los departamentos de tu hospital.</p>
              </div>
            )}


            {activeTab === 'logs' && (
              <div className="space-y-6">
                <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)] shadow-sm">
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-[var(--foreground)]">Registro de Asistencia</h2>
                      <p className="text-[var(--foreground-secondary)] mt-1">Historial de detecciones faciales</p>
                    </div>
                    <button className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors text-sm font-medium">
                      Exportar CSV
                    </button>
                  </div>

                  <div className="space-y-3">
                    {logs.length === 0 ? (
                      <div className="text-center py-12 text-[var(--foreground-secondary)]">
                        <FileText size={32} className="mx-auto mb-3 opacity-50" />
                        <p>Sin registros de asistencia</p>
                      </div>
                    ) : (
                      <>
                        {/* Desktop Table View */}
                        <div className="hidden lg:block overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-[var(--border)] bg-[var(--secondary)]">
                                <th className="text-left px-4 py-3 text-sm font-semibold text-[var(--foreground)]">Empleado</th>
                                <th className="text-left px-4 py-3 text-sm font-semibold text-[var(--foreground)]">Hora</th>
                                <th className="text-left px-4 py-3 text-sm font-semibold text-[var(--foreground)]">Fecha</th>
                                <th className="text-left px-4 py-3 text-sm font-semibold text-[var(--foreground)]">Estado</th>
                              </tr>
                            </thead>
                            <tbody>
                              {logs.map((log) => (
                                <tr key={log.id} className="border-b border-[var(--border)] hover:bg-[var(--secondary)] transition-colors">
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                                        {(log.user_name || '?').charAt(0).toUpperCase()}
                                      </div>
                                      <span className="text-[var(--foreground)]">{log.user_name || 'Desconocido'}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-[var(--foreground)]">
                                    {new Date(log.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                  </td>
                                  <td className="px-4 py-3 text-[var(--foreground-secondary)]">
                                    {new Date(log.timestamp).toLocaleDateString('es-ES')}
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 border border-green-300 rounded-lg">
                                      <CheckCircle2 size={14} className="text-green-600" />
                                      <span className="text-xs font-medium text-green-600">{log.status === 'present' ? 'Presente' : log.status}</span>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="lg:hidden space-y-3">
                          {logs.map((log) => (
                            <div key={log.id} className="p-4 bg-[var(--secondary)] rounded-lg border border-[var(--border)]">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-blue-600 flex items-center justify-center text-white font-semibold">
                                    {(log.user_name || '?').charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-[var(--foreground)]">{log.user_name || 'Desconocido'}</p>
                                    <p className="text-xs text-[var(--foreground-secondary)]">Asistencia</p>
                                  </div>
                                </div>
                                <CheckCircle2 size={20} className="text-green-600" />
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-[var(--foreground-secondary)]">{new Date(log.timestamp).toLocaleDateString('es-ES')}</span>
                                <span className="text-[var(--foreground)] font-medium">{new Date(log.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <SettingsPanel />
            )}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--card)] border-t border-[var(--border)] safe-area-inset-bottom shadow-2xl">
        <div className="flex items-center justify-around px-2 py-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors ${isActive ? 'text-[var(--primary)]' : 'text-[var(--foreground-secondary)]'
                  }`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

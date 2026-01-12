import { useState } from 'react';
import { Scan, Users, FileText, Settings, Menu, X, ChevronLeft } from 'lucide-react';
import { ScannerView } from './ScannerView';
import { StaffManagement } from './StaffManagement';

interface DashboardProps {
  onNavigateToLanding?: () => void;
}

export function Dashboard({ onNavigateToLanding }: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('scanner');

  const menuItems = [
    { id: 'scanner', icon: Scan, label: 'Scanner' },
    { id: 'staff', icon: Users, label: 'Staff' },
    { id: 'logs', icon: FileText, label: 'Logs' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-[#F8FAFC]">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-[#E2E8F0] transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#E2E8F0]">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-[16px] bg-[#0284C7] flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2L15 6V12L9 16L3 12V6L9 2Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-lg font-semibold text-[#0F172A]">MediScan AI</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-[#64748B] hover:text-[#0F172A] transition-colors"
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-[16px] transition-all ${
                  isActive
                    ? 'bg-[#0284C7] text-white'
                    : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-[#E2E8F0]">
            <button
              onClick={onNavigateToLanding}
              className="w-full px-4 py-3 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-[16px] transition-all text-left"
            >
              Back to Landing
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-[#E2E8F0] h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[16px] bg-[#0284C7] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L15 6V12L9 16L3 12V6L9 2Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-lg font-semibold text-[#0F172A]">MediScan AI</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-[#0F172A]"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-white w-64 h-full p-4 space-y-2" onClick={(e) => e.stopPropagation()}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-[16px] transition-all ${
                    isActive
                      ? 'bg-[#0284C7] text-white'
                      : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
            <div className="pt-4 border-t border-[#E2E8F0]">
              <button
                onClick={onNavigateToLanding}
                className="w-full px-4 py-3 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-[16px] transition-all text-left"
              >
                Back to Landing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Content Header */}
        <div className="bg-white border-b border-[#E2E8F0] px-6 py-4">
          <h1 className="text-2xl font-semibold text-[#0F172A] capitalize">{activeTab}</h1>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'scanner' && (
              <ScannerView />
            )}

            {activeTab === 'staff' && (
              <StaffManagement />
            )}

            {activeTab === 'logs' && (
              <div className="bg-white rounded-[16px] p-8 shadow-sm">
                <h2 className="text-xl font-semibold text-[#0F172A] mb-6">Attendance Logs</h2>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-[16px]">
                      <div>
                        <p className="font-medium text-[#0F172A]">Staff Member {i}</p>
                        <p className="text-sm text-[#64748B]">Check-in</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[#0F172A]">09:0{i} AM</p>
                        <p className="text-sm text-[#64748B]">Today</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-[16px] p-8 shadow-sm">
                <h2 className="text-xl font-semibold text-[#0F172A] mb-6">System Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[#0F172A] mb-2">Organization Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                      placeholder="Enter organization name"
                    />
                  </div>
                  <div>
                    <label className="block text-[#0F172A] mb-2">Recognition Threshold</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="85"
                      className="w-full"
                    />
                    <p className="text-sm text-[#64748B] mt-1">85% confidence required</p>
                  </div>
                  <div>
                    <label className="block text-[#0F172A] mb-2">Notification Settings</label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-5 h-5 rounded accent-[#0284C7]" defaultChecked />
                        <span className="text-[#0F172A]">Email notifications</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-5 h-5 rounded accent-[#0284C7]" defaultChecked />
                        <span className="text-[#0F172A]">Real-time alerts</span>
                      </label>
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-[#0284C7] text-white rounded-[16px] hover:bg-[#0369A1] transition-colors">
                    Save Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] safe-area-inset-bottom">
        <div className="flex items-center justify-around px-2 py-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-[16px] transition-colors ${
                  isActive ? 'text-[#0284C7]' : 'text-[#64748B]'
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
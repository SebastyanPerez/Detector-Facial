import { useState, useEffect } from 'react';
import { Scan, CheckCircle2, XCircle, Clock, User } from 'lucide-react';

type ScanStatus = 'idle' | 'scanning' | 'success' | 'error';

interface RecentActivity {
  id: number;
  name: string;
  role: string;
  time: string;
  status: 'success' | 'error';
}

export function ScannerView() {
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
  const [scanResult, setScanResult] = useState<{ name: string; time: string } | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    { id: 1, name: 'Dr. Emily Johnson', role: 'Cardiologist', time: '08:45 AM', status: 'success' },
    { id: 2, name: 'Nurse Michael Chen', role: 'ICU Nurse', time: '08:42 AM', status: 'success' },
    { id: 3, name: 'Dr. Sarah Williams', role: 'Surgeon', time: '08:38 AM', status: 'success' },
    { id: 4, name: 'Tech David Brown', role: 'Lab Technician', time: '08:35 AM', status: 'success' },
  ]);

  // Simulate scanning demo
  const startScan = () => {
    setScanStatus('scanning');
    setScanResult(null);

    // Randomly succeed or fail after 2 seconds
    setTimeout(() => {
      const success = Math.random() > 0.2;
      if (success) {
        const time = new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        });
        setScanStatus('success');
        setScanResult({ name: 'Dr. Smith', time });
        
        // Add to recent activity
        const newActivity: RecentActivity = {
          id: Date.now(),
          name: 'Dr. Smith',
          role: 'Emergency Medicine',
          time,
          status: 'success'
        };
        setRecentActivity(prev => [newActivity, ...prev.slice(0, 3)]);
        
        // Reset after 3 seconds
        setTimeout(() => {
          setScanStatus('idle');
          setScanResult(null);
        }, 3000);
      } else {
        setScanStatus('error');
        
        // Reset after 3 seconds
        setTimeout(() => {
          setScanStatus('idle');
        }, 3000);
      }
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Camera Viewport Section */}
      <div className="bg-[var(--card)] rounded-2xl shadow-sm overflow-hidden border border-[var(--border)]">
        <div className="p-6 border-b border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[var(--foreground)]">Facial Recognition Scanner</h2>
              <p className="text-[var(--foreground-secondary)] mt-1">Position your face within the frame for identification</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--secondary)] rounded-xl border border-[var(--border)]">
              <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse"></div>
              <span className="text-sm font-medium text-[var(--foreground)]">Camera Active</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* 16:9 Camera Viewport */}
          <div className="relative w-full aspect-video bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl overflow-hidden border-2 border-[var(--border)]">
            {/* Camera Feed Simulation */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
              {/* Grid Pattern for Clinical Look */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-12 h-full">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="border-r border-white/20"></div>
                  ))}
                </div>
              </div>
              
              {/* Center Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white/60">
                  <User size={64} className="mx-auto mb-4 opacity-40" />
                  <p className="text-sm">Camera feed simulation</p>
                </div>
              </div>
            </div>

            {/* Scanning Reticle Overlay */}
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
              scanStatus === 'scanning' ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                {/* Animated Scanning Line */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent animate-scan"></div>
                </div>
                
                {/* Corner Brackets */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[var(--primary)] rounded-tl-2xl"></div>
                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[var(--primary)] rounded-tr-2xl"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[var(--primary)] rounded-bl-2xl"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[var(--primary)] rounded-br-2xl"></div>
                
                {/* Center Crosshair */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-[var(--primary)]/50"></div>
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[var(--primary)]/50"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[var(--primary)] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Overlay */}
            <div className={`absolute inset-0 bg-[var(--success)]/20 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${
              scanStatus === 'success' ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
              <div className="text-center">
                <CheckCircle2 size={64} className="text-[var(--success)] mx-auto mb-4 animate-scale-in" />
                <p className="text-white text-xl font-semibold">Recognition Successful</p>
              </div>
            </div>

            {/* Error Overlay */}
            <div className={`absolute inset-0 bg-[var(--destructive)]/20 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${
              scanStatus === 'error' ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
              <div className="text-center">
                <XCircle size={64} className="text-[var(--destructive)] mx-auto mb-4 animate-scale-in" />
                <p className="text-white text-xl font-semibold">Recognition Failed</p>
                <p className="text-white/80 text-sm mt-2">Please try again</p>
              </div>
            </div>

            {/* Scan Button Overlay */}
            {scanStatus === 'idle' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={startScan}
                  className="px-8 py-4 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-hover)] transition-all shadow-lg flex items-center gap-3 text-lg font-medium"
                >
                  <Scan size={24} />
                  Start Scanning
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Card and Recent Activity Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Status Card */}
        <div className="bg-[var(--card)] rounded-2xl shadow-sm overflow-hidden border border-[var(--border)]">
          <div className="p-6 border-b border-[var(--border)]">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Current Status</h3>
          </div>
          <div className="p-6">
            {/* Idle State */}
            {scanStatus === 'idle' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-xl bg-[var(--secondary)] flex items-center justify-center mx-auto mb-4">
                  <Scan className="text-[var(--foreground-secondary)]" size={32} />
                </div>
                <p className="text-[var(--foreground-secondary)] text-lg">Ready to scan</p>
                <p className="text-[var(--muted-foreground)] text-sm mt-1">Click "Start Scanning" to begin</p>
              </div>
            )}

            {/* Scanning State - Blue */}
            {scanStatus === 'scanning' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-4">
                  <Scan className="text-[var(--primary)] animate-pulse" size={32} />
                </div>
                <p className="text-[var(--primary)] text-lg font-semibold">Scanning...</p>
                <p className="text-[var(--foreground-secondary)] text-sm mt-1">Analyzing facial features</p>
                <div className="mt-4 max-w-xs mx-auto">
                  <div className="h-1.5 bg-[var(--secondary)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--primary)] rounded-full animate-progress"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Success State - Green */}
            {scanStatus === 'success' && scanResult && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-xl bg-[var(--success-bg)] flex items-center justify-center mx-auto mb-4 border border-[var(--success-border)]">
                  <CheckCircle2 className="text-[var(--success)]" size={32} />
                </div>
                <p className="text-[var(--success)] text-lg font-semibold mb-1">Recognition Successful</p>
                <div className="mt-4 p-4 bg-[var(--success-bg)] border border-[var(--success-border)] rounded-xl">
                  <p className="text-[var(--foreground)] text-xl font-semibold">{scanResult.name}</p>
                  <p className="text-[var(--foreground-secondary)] text-sm mt-1">Check-in recorded at {scanResult.time}</p>
                </div>
              </div>
            )}

            {/* Error State - Red */}
            {scanStatus === 'error' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-xl bg-[var(--destructive-bg)] flex items-center justify-center mx-auto mb-4 border border-[var(--destructive-border)]">
                  <XCircle className="text-[var(--destructive)]" size={32} />
                </div>
                <p className="text-[var(--destructive)] text-lg font-semibold mb-1">Recognition Failed</p>
                <div className="mt-4 p-4 bg-[var(--destructive-bg)] border border-[var(--destructive-border)] rounded-xl">
                  <p className="text-[var(--foreground)] font-medium">Unable to identify</p>
                  <p className="text-[var(--foreground-secondary)] text-sm mt-1">Please ensure proper lighting and face positioning</p>
                </div>
                <button
                  onClick={startScan}
                  className="mt-4 px-6 py-2.5 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-hover)] transition-colors text-sm font-medium"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-[var(--card)] rounded-2xl shadow-sm overflow-hidden border border-[var(--border)]">
          <div className="p-6 border-b border-[var(--border)]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">Recent Activity</h3>
              <div className="flex items-center gap-2 text-[var(--foreground-secondary)]">
                <Clock size={16} />
                <span className="text-sm">Live</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div 
                  key={activity.id}
                  className="flex items-center gap-4 p-4 bg-[var(--secondary)] hover:bg-[var(--muted)] rounded-xl transition-colors border border-[var(--border)]"
                  style={{ 
                    animation: index === 0 && scanStatus === 'success' ? 'slideIn 0.3s ease-out' : 'none' 
                  }}
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                    {activity.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[var(--foreground)] truncate">{activity.name}</p>
                    <p className="text-sm text-[var(--foreground-secondary)] truncate">{activity.role}</p>
                  </div>
                  
                  {/* Time & Status */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-[var(--foreground)]">{activity.time}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'success' ? 'bg-[var(--success)]' : 'bg-[var(--destructive)]'
                      }`}></div>
                      <span className={`text-xs font-medium ${
                        activity.status === 'success' ? 'text-[var(--success)]' : 'text-[var(--destructive)]'
                      }`}>
                        {activity.status === 'success' ? 'Verified' : 'Failed'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(320px);
          }
        }
        
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes slideIn {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        
        .animate-progress {
          animation: progress 2s ease-in-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
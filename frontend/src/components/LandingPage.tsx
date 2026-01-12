import { Navbar } from './Navbar';
import { Scan, Shield, Zap, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onNavigateToDashboard?: () => void;
}

export function LandingPage({ onNavigateToDashboard }: LandingPageProps) {
  const handleNavigation = (section: string) => {
    if (section === 'demo' && onNavigateToDashboard) {
      onNavigateToDashboard();
    }
    console.log('Navigate to:', section);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={handleNavigation} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F8FAFC] rounded-[16px] mb-6">
              <span className="text-sm text-[#0284C7] font-medium">Now Available</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-[#0F172A] mb-6 leading-tight tracking-tight">
              Biometric Attendance for Modern Hospitals
            </h1>
            
            <p className="text-xl text-[#64748B] mb-10 max-w-2xl mx-auto leading-relaxed">
              Revolutionary facial recognition technology designed specifically for healthcare environments. 
              Secure, contactless, and HIPAA-compliant attendance tracking.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => handleNavigation('demo')}
                className="px-8 py-4 bg-[#0284C7] text-white rounded-[16px] hover:bg-[#0369A1] transition-all flex items-center justify-center gap-2 text-lg font-medium shadow-lg shadow-[#0284C7]/20"
              >
                Request Demo
                <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => handleNavigation('learn-more')}
                className="px-8 py-4 bg-[#F8FAFC] text-[#0F172A] rounded-[16px] hover:bg-[#E2E8F0] transition-all text-lg font-medium"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 lg:px-8 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-[#0F172A] mb-4">
              Built for Healthcare
            </h2>
            <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
              Enterprise-grade features designed to meet the demanding needs of modern hospitals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1: Contactless */}
            <div className="bg-white rounded-[16px] p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-[16px] bg-[#0284C7]/10 flex items-center justify-center mb-6">
                <Scan className="text-[#0284C7]" size={24} />
              </div>
              <h3 className="text-2xl font-semibold text-[#0F172A] mb-4">
                Contactless
              </h3>
              <p className="text-[#64748B] leading-relaxed">
                Zero-touch facial recognition ensures hygiene and safety in clinical environments. 
                No physical contact required for attendance tracking.
              </p>
            </div>

            {/* Feature 2: HIPAA Ready */}
            <div className="bg-white rounded-[16px] p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-[16px] bg-[#0284C7]/10 flex items-center justify-center mb-6">
                <Shield className="text-[#0284C7]" size={24} />
              </div>
              <h3 className="text-2xl font-semibold text-[#0F172A] mb-4">
                HIPAA Ready
              </h3>
              <p className="text-[#64748B] leading-relaxed">
                Built with compliance at its core. End-to-end encryption and secure data handling 
                meet all HIPAA requirements for healthcare data.
              </p>
            </div>

            {/* Feature 3: Real-time */}
            <div className="bg-white rounded-[16px] p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-[16px] bg-[#0284C7]/10 flex items-center justify-center mb-6">
                <Zap className="text-[#0284C7]" size={24} />
              </div>
              <h3 className="text-2xl font-semibold text-[#0F172A] mb-4">
                Real-time
              </h3>
              <p className="text-[#64748B] leading-relaxed">
                Instant attendance verification with real-time dashboards and alerts. 
                Monitor staff presence across multiple departments simultaneously.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#0284C7] rounded-[16px] p-12 md:p-16 text-center">
            <h2 className="text-4xl font-semibold text-white mb-4">
              Ready to modernize your hospital?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join leading healthcare institutions using MediScan AI for secure, 
              efficient attendance management.
            </p>
            <button 
              onClick={() => handleNavigation('demo')}
              className="px-8 py-4 bg-white text-[#0284C7] rounded-[16px] hover:bg-[#F8FAFC] transition-all text-lg font-medium shadow-lg inline-flex items-center gap-2"
            >
              Request Demo
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-8 border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-[16px] bg-[#0284C7] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L15 6V12L9 16L3 12V6L9 2Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-lg font-semibold text-[#0F172A]">MediScan AI</span>
          </div>
          <p className="text-[#64748B]">© 2026 MediScan AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

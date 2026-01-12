import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onNavigate?: (section: string) => void;
}

export function Navbar({ onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigation = (section: string) => {
    if (onNavigate) {
      onNavigate(section);
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigation('home')}>
            <div className="w-8 h-8 rounded-[16px] bg-[#0284C7] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L15 6V12L9 16L3 12V6L9 2Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-lg font-semibold text-[#0F172A]">MediScan AI</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => handleNavigation('product')}
              className="text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              Product
            </button>
            <button 
              onClick={() => handleNavigation('pricing')}
              className="text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              Pricing
            </button>
            <button 
              onClick={() => handleNavigation('login')}
              className="text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              Login
            </button>
            <button 
              onClick={() => handleNavigation('demo')}
              className="px-5 py-2.5 bg-[#0284C7] text-white rounded-[16px] hover:bg-[#0369A1] transition-colors"
            >
              Request Demo
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-[#0F172A]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#E2E8F0]">
          <div className="px-6 py-4 space-y-4">
            <button 
              onClick={() => handleNavigation('product')}
              className="block w-full text-left text-[#64748B] hover:text-[#0F172A] transition-colors py-2"
            >
              Product
            </button>
            <button 
              onClick={() => handleNavigation('pricing')}
              className="block w-full text-left text-[#64748B] hover:text-[#0F172A] transition-colors py-2"
            >
              Pricing
            </button>
            <button 
              onClick={() => handleNavigation('login')}
              className="block w-full text-left text-[#64748B] hover:text-[#0F172A] transition-colors py-2"
            >
              Login
            </button>
            <button 
              onClick={() => handleNavigation('demo')}
              className="w-full px-5 py-2.5 bg-[#0284C7] text-white rounded-[16px] hover:bg-[#0369A1] transition-colors"
            >
              Request Demo
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

import { useState } from 'react';
import { Menu, X, Scan, Shield, Zap, ArrowRight, CheckCircle2, Play, Star, Lock, Cloud, BarChart3 } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface EnhancedLandingPageProps {
  onNavigateToDashboard?: () => void;
}

export function EnhancedLandingPage({ onNavigateToDashboard }: EnhancedLandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Scan,
      title: 'Eficiencia sin Contacto',
      description: 'Reconocimiento facial sin contacto que garantiza higiene y seguridad en entornos clínicos. No se requiere contacto físico.',
    },
    {
      icon: Shield,
      title: 'Cumplimiento GDPR/HIPAA',
      description: 'Construido con el cumplimiento como base. Cifrado de extremo a extremo y manejo seguro de datos.',
    },
    {
      icon: Lock,
      title: 'Seguridad Robusta',
      description: 'Cifrado de grado militar sin almacenamiento de imágenes. Solo se retienen embeddings biométricos, garantizando máxima privacidad.',
    },
    {
      icon: Cloud,
      title: 'Integración Perfecta',
      description: 'Fácil integración con sistemas de gestión hospitalaria existentes. API RESTful y documentación completa incluida.',
    },
  ];

  const testimonials = [
    {
      name: 'Dra. Sarah Mitchell',
      role: 'Directora Médica',
      hospital: 'Hospital Santa María',
      quote: 'MediScan AI ha transformado nuestra gestión de asistencia. El sistema sin contacto es perfecto para nuestro entorno estéril.',
    },
    {
      name: 'James Rodriguez',
      role: 'Director de TI',
      hospital: 'Centro Médico Central',
      quote: 'La implementación fue perfecta y las características de cumplimiento HIPAA nos dan total tranquilidad.',
    },
    {
      name: 'Dra. Emily Chen',
      role: 'Jefa de Departamento',
      hospital: 'Instituto Metro Health',
      quote: 'El seguimiento y los informes en tiempo real han mejorado nuestra eficiencia operativa en un 40%.',
    },
  ];

  const hospitals = [
    'St. Mary\'s Hospital',
    'Central Medical',
    'Metro Health',
    'City General',
    'Regional Care',
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-[var(--background)]/80 backdrop-blur-xl z-50 border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-[12px] bg-[var(--primary)] flex items-center justify-center shadow-lg shadow-[var(--primary)]/20">
                <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2L15 6V12L9 16L3 12V6L9 2Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-lg sm:text-xl font-semibold text-[var(--foreground)]">MediScan AI</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <a href="#features" className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors">
                Características
              </a>
              <a href="#testimonials" className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors">
                Testimonios
              </a>
              <a href="#demo" className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors">
                Demo
              </a>
              <ThemeToggle />
              <button
                onClick={onNavigateToDashboard}
                className="px-5 py-2.5 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-hover)] transition-all shadow-lg shadow-[var(--primary)]/20"
              >
                Solicitar Demo
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-3">
              <ThemeToggle />
              <button
                className="text-[var(--foreground)]"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[var(--background)] border-t border-[var(--border)]">
            <div className="px-4 py-6 space-y-4">
              <a href="#features" className="block text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors py-2">
                Características
              </a>
              <a href="#testimonials" className="block text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors py-2">
                Testimonios
              </a>
              <a href="#demo" className="block text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors py-2">
                Demo
              </a>
              <button
                onClick={onNavigateToDashboard}
                className="w-full px-5 py-3 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-hover)] transition-all shadow-lg shadow-[var(--primary)]/20"
              >
                Solicitar Demo
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 lg:pt-40 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--secondary)] rounded-full mb-6 sm:mb-8 border border-[var(--border)]">
              <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse"></div>
              <span className="text-sm font-medium text-[var(--primary)]">Disponible para Instituciones de Salud</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-[var(--foreground)] mb-6 sm:mb-8 leading-tight tracking-tight">
              Transformando la Asistencia Hospitalaria con IA
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl lg:text-2xl text-[var(--foreground-secondary)] mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
              Tecnología revolucionaria de reconocimiento facial diseñada para entornos sanitarios.
              Segura, sin contacto y totalmente compatible.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 sm:mb-16">
              <button
                onClick={onNavigateToDashboard}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-hover)] transition-all flex items-center justify-center gap-2 text-base sm:text-lg font-medium shadow-lg shadow-[var(--primary)]/20"
              >
                Solicitar una Demo
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-[var(--secondary)] text-[var(--foreground)] rounded-xl hover:bg-[var(--muted)] transition-all text-base sm:text-lg font-medium border border-[var(--border)]"
              >
                Explorar Características
              </button>
            </div>

            {/* Hero Visual */}
            <div className="relative max-w-5xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--primary)]/10 to-[var(--primary)]/5 p-1 shadow-2xl">
                <div className="bg-[var(--card)] rounded-2xl p-6 sm:p-8 lg:p-12">
                  <div className="aspect-video bg-gradient-to-br from-[var(--background-secondary)] to-[var(--muted)] rounded-xl flex items-center justify-center relative overflow-hidden border border-[var(--border)]">
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-transparent animate-pulse"></div>
                    </div>
                    <div className="relative z-10 text-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mx-auto mb-4">
                        <Scan size={32} className="text-[var(--primary)]" />
                      </div>
                      <p className="text-[var(--foreground-secondary)] text-sm sm:text-base">Reconocimiento Biométrico Avanzado</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-[var(--primary)]/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[var(--primary)]/10 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-y border-[var(--border)] bg-[var(--background-secondary)]">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm text-[var(--foreground-secondary)] mb-8">Con la confianza de instituciones líderes</p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
            {hospitals.map((hospital) => (
              <div key={hospital} className="text-[var(--foreground-secondary)] font-medium opacity-60 hover:opacity-100 transition-opacity">
                {hospital}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[var(--foreground)] mb-4 sm:mb-6">
              Construido para el Cuidado de la Salud
            </h2>
            <p className="text-lg sm:text-xl text-[var(--foreground-secondary)] max-w-2xl mx-auto">
              Características de nivel empresarial diseñadas para satisfacer las exigentes necesidades de los hospitales modernos
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-[var(--card)] rounded-2xl p-6 sm:p-8 border border-[var(--border)] hover:shadow-lg transition-all hover:-translate-y-1 group"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-[var(--primary)]/20 transition-colors">
                    <Icon className="text-[var(--primary)]" size={24} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-[var(--foreground)] mb-3 sm:mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--foreground-secondary)] leading-relaxed text-sm sm:text-base">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Additional Features Grid */}
          <div className="mt-12 sm:mt-16 grid sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex items-start gap-4 p-6 bg-[var(--secondary)] rounded-xl border border-[var(--border)]">
              <CheckCircle2 className="text-[var(--success)] flex-shrink-0 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-[var(--foreground)] mb-1">Monitoreo en Tiempo Real</h4>
                <p className="text-sm text-[var(--foreground-secondary)]">Paneles en vivo y alertas instantáneas para el seguimiento de asistencia</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-[var(--secondary)] rounded-xl border border-[var(--border)]">
              <CheckCircle2 className="text-[var(--success)] flex-shrink-0 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-[var(--foreground)] mb-1">Sin Almacenamiento de Imágenes</h4>
                <p className="text-sm text-[var(--foreground-secondary)]">Solo se conservan los embeddings biométricos para máxima privacidad</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-[var(--secondary)] rounded-xl border border-[var(--border)]">
              <CheckCircle2 className="text-[var(--success)] flex-shrink-0 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-[var(--foreground)] mb-1">Analítica Avanzada</h4>
                <p className="text-sm text-[var(--foreground-secondary)]">Informes completos y análisis de asistencia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[var(--background-secondary)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[var(--foreground)] mb-4 sm:mb-6">
              Con la Confianza de Profesionales
            </h2>
            <p className="text-lg sm:text-xl text-[var(--foreground-secondary)] max-w-2xl mx-auto">
              Vea lo que dicen los profesionales médicos sobre MediScan AI
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-[var(--card)] rounded-2xl p-6 sm:p-8 border border-[var(--border)] hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-[var(--warning)] fill-[var(--warning)]" />
                  ))}
                </div>
                <p className="text-[var(--foreground)] mb-6 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] flex items-center justify-center text-white font-semibold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">{testimonial.name}</p>
                    <p className="text-sm text-[var(--foreground-secondary)]">{testimonial.role}</p>
                    <p className="text-xs text-[var(--foreground-secondary)]">{testimonial.hospital}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo CTA Section */}
      <section id="demo" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] rounded-3xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white blur-2xl"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white blur-2xl"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-4 sm:mb-6">
                Vea MediScan AI en Acción
              </h2>
              <p className="text-lg sm:text-xl text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto">
                Experimente el poder de nuestro sistema de asistencia biométrica. Pruebe nuestra demostración en vivo y vea lo fácil que es gestionar al personal del hospital.
              </p>
              <button
                onClick={onNavigateToDashboard}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-[var(--primary)] rounded-xl hover:bg-gray-50 transition-all text-base sm:text-lg font-medium shadow-lg inline-flex items-center gap-2"
              >
                <Play size={20} />
                Lanzar Dashboard Demo
              </button>

              <div className="mt-12 grid sm:grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto">
                <div className="text-white">
                  <div className="text-3xl sm:text-4xl font-bold mb-2">99.9%</div>
                  <div className="text-sm sm:text-base text-white/80">Precisión de Reconocimiento</div>
                </div>
                <div className="text-white">
                  <div className="text-3xl sm:text-4xl font-bold mb-2">&lt;2s</div>
                  <div className="text-sm sm:text-base text-white/80">Tiempo Promedio de Escaneo</div>
                </div>
                <div className="text-white">
                  <div className="text-3xl sm:text-4xl font-bold mb-2">24/7</div>
                  <div className="text-sm sm:text-base text-white/80">Soporte Disponible</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)] bg-[var(--background-secondary)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-[var(--primary)] flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 2L15 6V12L9 16L3 12V6L9 2Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-lg font-semibold text-[var(--foreground)]">MediScan AI</span>
              </div>
              <p className="text-sm text-[var(--foreground-secondary)]">
                Reconocimiento facial revolucionario para la gestión moderna de asistencia sanitaria.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[var(--foreground)] mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-[var(--foreground-secondary)]">
                <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">Demo</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[var(--foreground)] mb-4">Compañía</h4>
              <ul className="space-y-2 text-sm text-[var(--foreground-secondary)]">
                <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">Acerca de</a></li>
                <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">Privacidad</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[var(--foreground)] mb-4">Soporte</h4>
              <ul className="space-y-2 text-sm text-[var(--foreground-secondary)]">
                <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">Documentación</a></li>
                <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">Estado</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[var(--border)] text-center">
            <p className="text-sm text-[var(--foreground-secondary)]">
              © 2026 MediScan AI. Todos los derechos reservados. Cumple con GDPR y HIPAA.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { Search, Plus, CheckCircle2, XCircle, Clock, X, Camera, User, Power } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from './ui/skeleton';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useOrg } from '../contexts/OrgContext';

interface Staff {

  id: string | number;
  name: string;
  role: string;
  department: string;
  biometricStatus: 'enrolled' | 'pending' | 'failed';
  email: string;
  phone: string;
  enrolledDate?: string;
}

interface FormData {
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  employee_id: string;
}

export function StaffManagement() {
  const { user } = useAuth();
  const { departments } = useOrg();
  const [searchQuery, setSearchQuery] = useState('');
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [enrollmentStep, setEnrollmentStep] = useState(1);
  const [cameraActive, setCameraActive] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    role: '',
    department: '',
    email: '',
    phone: '',
    employee_id: '',
  });


  const [staffData, setStaffData] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);

  // Cargar empleados al montar el componente
  useEffect(() => {
    loadStaff();
  }, [user]);

  // Manejar cámara al cambiar enrollmentStep o cameraActive
  useEffect(() => {
    if (enrollmentStep === 2 && cameraActive) {
      startCamera();
    }

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [enrollmentStep, cameraActive]);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const users = await api.getUsers();
      const formattedStaff: Staff[] = users.map((apiUser: any, idx: number) => ({
        id: apiUser.id || idx,
        name: apiUser.name || 'Sin Nombre',
        role: apiUser.role || 'Staff',
        department: apiUser.department || 'General',
        biometricStatus: 'enrolled',
        email: apiUser.email || '',
        phone: apiUser.phone || '',
        enrolledDate: apiUser.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      }));
      setStaffData(formattedStaff);
      setError(null);
    } catch (err) {
      console.error('Error loading staff:', err);
      toast.error('No se pudieron cargar los empleados');
      setError('No se pudieron cargar los empleados.');
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      toast.error('No se pudo acceder a la cámara');
      setCameraActive(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNextStep = async () => {
    if (enrollmentStep === 1) {
      if (!formData.name.trim()) {
        toast.warning('Por favor ingresa un nombre');
        return;
      }
      setEnrollmentStep(2);
      setCameraActive(true);
    } else if (enrollmentStep === 2) {
      if (!cameraActive) {
        toast.warning('Por favor enciende la cámara');
        return;
      }
      await captureFaceImage();
    }
  };

  const captureFaceImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      const context = canvasRef.current.getContext('2d');
      if (context && videoRef.current.videoWidth) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);

        setIsCapturing(true);
        setCaptureProgress(0);

        // Store image immediately
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        setCapturedImage(imageData);

        let progress = 0;
        const interval = setInterval(() => {
          progress += 25;
          setCaptureProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            setIsCapturing(false);
            setEnrollmentStep(3);
          }
        }, 300);
      }
    } catch (err) {
      console.error('Error capturing image:', err);
      toast.error('Error al capturar la imagen');
    }
  };

  const handleCloseModal = () => {
    setShowEnrollmentModal(false);
    setEnrollmentStep(1);
    setCameraActive(false);
    setCaptureProgress(0);
    setIsCapturing(false);
    setCapturedImage(null);
    setRegistering(false);
    setFormData({
      name: '',
      role: '',
      department: '',
      email: '',
      phone: '',
      employee_id: '',
    });


    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleComplete = async () => {
    if (!capturedImage) {
      toast.error("No hay imagen capturada");
      return;
    }

    try {
      setRegistering(true);
      // Remove header if present
      const base64Image = capturedImage.includes(',') ? capturedImage.split(',')[1] : capturedImage;

      const result = await api.registerFace(formData.name, base64Image);

      if (result.id) {
        const newStaff: Staff = {
          id: result.id,
          name: formData.name,
          role: formData.role,
          department: formData.department,
          biometricStatus: 'enrolled',
          email: formData.email,
          phone: formData.phone,
          enrolledDate: new Date().toISOString().split('T')[0],
        };
        setStaffData([newStaff, ...staffData]);
        handleCloseModal();
        toast.success('Empleado registrado exitosamente');
      }
    } catch (err: any) {
      console.error('Error registering employee:', err);
      toast.error(`Error al registrar: ${err.response?.data?.detail || 'Error de conexión'}`);
    } finally {
      setRegistering(false);
    }
  };

  const filteredStaff = staffData.filter(staff =>
    (staff.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (staff.role || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (staff.department || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getBiometricStatusBadge = (status: string) => {
    const configs: Record<string, { bg: string; border: string; icon: typeof CheckCircle2; color: string; label: string }> = {
      enrolled: {
        bg: 'bg-green-100',
        border: 'border-green-300',
        icon: CheckCircle2,
        color: 'text-green-600',
        label: 'Inscrito'
      },
      pending: {
        bg: 'bg-yellow-100',
        border: 'border-yellow-300',
        icon: Clock,
        color: 'text-yellow-600',
        label: 'Pendiente'
      },
      failed: {
        bg: 'bg-red-100',
        border: 'border-red-300',
        icon: XCircle,
        color: 'text-red-600',
        label: 'Fallido'
      },
    };

    const config = configs[status] || configs.pending;
    const Icon = config.icon;

    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${config.bg} border ${config.border} rounded-lg`}>
        <Icon size={14} className={config.color} />
        <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-[var(--card)] rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--foreground)]">Gestión de Empleados</h2>
            <p className="text-[var(--foreground-secondary)] mt-1">Registra y administra el personal biométricamente</p>
          </div>
          <button
            onClick={() => setShowEnrollmentModal(true)}
            className="px-5 py-3 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-hover)] transition-colors flex items-center gap-2 font-medium"
          >
            <Plus size={20} />
            Registrar Empleado
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-secondary)]" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre, puesto o departamento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[var(--secondary)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
            />
          </div>
        </div>
      </div>

      {/* Loading State (Skeleton) */}
      {loading && (
        <>
          <div className="hidden lg:block bg-[var(--card)] rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--secondary)]">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--foreground)]">Nombre</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--foreground)]">Puesto</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--foreground)]">Departamento</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--foreground)]">Contacto</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--foreground)]">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-b border-[var(--border)]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-lg" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Mobile Skeleton */}
          <div className="lg:hidden space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[var(--card)] rounded-xl shadow-sm p-4 border border-[var(--border)]">
                <div className="flex items-start gap-3 mb-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-300 rounded-xl p-4 text-red-800">
          {error}
        </div>
      )}

      {/* Staff List */}
      {!loading && !error && (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-[var(--card)] rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--secondary)]">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--foreground)]">Nombre</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--foreground)]">Puesto</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--foreground)]">Departamento</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--foreground)]">Contacto</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--foreground)]">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((staff) => (
                    <tr key={staff.id} className="border-b border-[var(--border)] hover:bg-[var(--secondary)] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                            {staff.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold text-[var(--foreground)]">{staff.name}</p>
                            {staff.enrolledDate && (
                              <p className="text-xs text-[var(--foreground-secondary)]">Inscrito {staff.enrolledDate}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[var(--foreground)]">{staff.role}</td>
                      <td className="px-6 py-4 text-[var(--foreground)]">{staff.department}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-[var(--foreground)]">{staff.email}</p>
                          <p className="text-xs text-[var(--foreground-secondary)]">{staff.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getBiometricStatusBadge(staff.biometricStatus)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {filteredStaff.length === 0 ? (
              <div className="text-center py-12 bg-[var(--card)] rounded-xl">
                <User size={48} className="mx-auto text-[var(--foreground-secondary)] mb-4 opacity-50" />
                <p className="text-[var(--foreground-secondary)]">No hay empleados registrados</p>
              </div>
            ) : (
              filteredStaff.map((staff) => (
                <div key={staff.id} className="bg-[var(--card)] rounded-xl shadow-sm p-4 border border-[var(--border)]">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {staff.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[var(--foreground)] mb-1">{staff.name}</h3>
                      <p className="text-sm text-[var(--foreground-secondary)]">{staff.role}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[var(--foreground-secondary)] min-w-[70px]">Depto:</span>
                      <span className="text-[var(--foreground)] font-medium">{staff.department}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[var(--foreground-secondary)] min-w-[70px]">Email:</span>
                      <span className="text-[var(--foreground)] truncate">{staff.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                    <span className="text-sm text-[var(--foreground-secondary)]">Estado</span>
                    {getBiometricStatusBadge(staff.biometricStatus)}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Enrollment Modal */}
      {showEnrollmentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--card)] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-[var(--card)] border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-[var(--foreground)]">Registrar Empleado</h3>
                <div className="flex items-center gap-2 mt-3">
                  {[1, 2, 3].map((step) => (
                    <div key={step}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${enrollmentStep >= step
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-[var(--secondary)] text-[var(--foreground-secondary)]'
                        }`}>
                        {step}
                      </div>
                      {step < 3 && (
                        <div className={`w-8 h-0.5 transition-all ${enrollmentStep > step ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] p-2 rounded-lg hover:bg-[var(--secondary)]"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Step 1 */}
              {enrollmentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-[var(--foreground)] mb-1">Información Personal</h4>
                    <p className="text-sm text-[var(--foreground-secondary)]">Ingresa los detalles del empleado</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Nombre Completo *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[var(--secondary)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                      placeholder="Juan Pérez García"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Puesto *</label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[var(--secondary)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] appearance-none"
                      >
                        <option value="">Seleccionar Puesto</option>
                        <option value="Médico">Médico</option>
                        <option value="Enfermero/a">Enfermero/a</option>
                        <option value="Administrativo">Administrativo</option>
                        <option value="Técnico">Técnico</option>
                        <option value="Seguridad">Seguridad</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Departamento *</label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[var(--secondary)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] appearance-none"
                      >
                        <option value="">Seleccionar Área</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.name}>{dept.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--foreground)] mb-2">ID de Empleado (Opcional)</label>
                      <input
                        type="text"
                        name="employee_id"
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[var(--secondary)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                        placeholder="MED-001"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[var(--secondary)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                        placeholder="juan@hospital.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Teléfono</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[var(--secondary)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                        placeholder="+56 912345678"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {enrollmentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-[var(--foreground)] mb-1">Captura Facial</h4>
                    <p className="text-sm text-[var(--foreground-secondary)]">Enciende la cámara y posiciónate frente a ella</p>
                  </div>
                  <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    {cameraActive ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center flex-col gap-4 bg-[#1a1a1a]">
                        <Camera size={48} className="text-gray-400" />
                        <p className="text-gray-400">Cámara apagada</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setCameraActive(!cameraActive)}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all font-medium ${cameraActive
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white'
                      }`}
                  >
                    <Power size={18} />
                    {cameraActive ? 'Apagar Cámara' : 'Encender Cámara'}
                  </button>
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              )}

              {/* Step 3 */}
              {enrollmentStep === 3 && (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-[var(--foreground)] mb-2">¡Listo!</h4>
                    <p className="text-sm text-[var(--foreground-secondary)]">Se capturó la imagen facial correctamente</p>
                  </div>
                  <div className="bg-[var(--secondary)] rounded-lg p-4 space-y-3 text-left">
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground-secondary)]">Nombre:</span>
                      <span className="font-medium text-[var(--foreground)]">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground-secondary)]">Puesto:</span>
                      <span className="font-medium text-[var(--foreground)]">{formData.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground-secondary)]">Departamento:</span>
                      <span className="font-medium text-[var(--foreground)]">{formData.department}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-[var(--card)] border-t border-[var(--border)] px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={handleCloseModal}
                disabled={registering}
                className="px-6 py-2 text-[var(--foreground)] hover:bg-[var(--secondary)] rounded-lg transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              {enrollmentStep < 3 && (
                <button
                  onClick={handleNextStep}
                  disabled={registering || (enrollmentStep === 1 && !formData.name.trim())}
                  className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50 font-medium"
                >
                  Siguiente
                </button>
              )}
              {enrollmentStep === 3 && (
                <button
                  onClick={handleComplete}
                  disabled={registering}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {registering ? 'Registrando...' : 'Completar'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

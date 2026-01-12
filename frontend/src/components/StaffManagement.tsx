import { useState } from 'react';
import { Search, Plus, MoreVertical, CheckCircle2, XCircle, Clock, X, ChevronRight, Camera, User } from 'lucide-react';

interface Staff {
  id: number;
  name: string;
  role: string;
  department: string;
  biometricStatus: 'enrolled' | 'pending' | 'failed';
  email: string;
  phone: string;
  enrolledDate?: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  employeeId: string;
}

export function StaffManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [enrollmentStep, setEnrollmentStep] = useState(1);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    employeeId: '',
  });

  const [staffData, setStaffData] = useState<Staff[]>([
    {
      id: 1,
      name: 'Dr. Emily Johnson',
      role: 'Cardiologist',
      department: 'Cardiology',
      biometricStatus: 'enrolled',
      email: 'e.johnson@hospital.com',
      phone: '+1 (555) 123-4567',
      enrolledDate: '2026-01-05',
    },
    {
      id: 2,
      name: 'Nurse Michael Chen',
      role: 'ICU Nurse',
      department: 'Intensive Care',
      biometricStatus: 'enrolled',
      email: 'm.chen@hospital.com',
      phone: '+1 (555) 234-5678',
      enrolledDate: '2026-01-04',
    },
    {
      id: 3,
      name: 'Dr. Sarah Williams',
      role: 'Surgeon',
      department: 'Surgery',
      biometricStatus: 'enrolled',
      email: 's.williams@hospital.com',
      phone: '+1 (555) 345-6789',
      enrolledDate: '2026-01-03',
    },
    {
      id: 4,
      name: 'Tech David Brown',
      role: 'Lab Technician',
      department: 'Laboratory',
      biometricStatus: 'pending',
      email: 'd.brown@hospital.com',
      phone: '+1 (555) 456-7890',
    },
    {
      id: 5,
      name: 'Admin Lisa Garcia',
      role: 'Administrator',
      department: 'Administration',
      biometricStatus: 'failed',
      email: 'l.garcia@hospital.com',
      phone: '+1 (555) 567-8901',
    },
  ]);

  const filteredStaff = staffData.filter(staff =>
    staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getBiometricStatusBadge = (status: string) => {
    switch (status) {
      case 'enrolled':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--success-bg)] border border-[var(--success-border)] rounded-lg">
            <CheckCircle2 size={14} className="text-[var(--success)]" />
            <span className="text-xs font-medium text-[var(--success)]">Enrolled</span>
          </div>
        );
      case 'pending':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--warning-bg)] border border-[var(--warning-border)] rounded-lg">
            <Clock size={14} className="text-[var(--warning)]" />
            <span className="text-xs font-medium text-[var(--warning)]">Pending</span>
          </div>
        );
      case 'failed':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--destructive-bg)] border border-[var(--destructive-border)] rounded-lg">
            <XCircle size={14} className="text-[var(--destructive)]" />
            <span className="text-xs font-medium text-[var(--destructive)]">Failed</span>
          </div>
        );
      default:
        return null;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNextStep = () => {
    if (enrollmentStep === 1) {
      setEnrollmentStep(2);
    } else if (enrollmentStep === 2) {
      startCapture();
    }
  };

  const startCapture = () => {
    setIsCapturing(true);
    setCaptureProgress(0);

    const interval = setInterval(() => {
      setCaptureProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCapturing(false);
          setTimeout(() => {
            setEnrollmentStep(3);
          }, 300);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleCloseModal = () => {
    setShowEnrollmentModal(false);
    setEnrollmentStep(1);
    setIsCapturing(false);
    setCaptureProgress(0);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      employeeId: '',
    });
  };

  const handleComplete = () => {
    // Add new staff member
    const newStaff: Staff = {
      id: staffData.length + 1,
      name: `${formData.firstName} ${formData.lastName}`,
      role: formData.role,
      department: formData.department,
      biometricStatus: 'enrolled',
      email: formData.email,
      phone: formData.phone,
      enrolledDate: new Date().toISOString().split('T')[0],
    };
    setStaffData([newStaff, ...staffData]);
    handleCloseModal();
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-[16px] shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#0F172A]">Staff Management</h2>
            <p className="text-[#64748B] mt-1">Manage staff members and biometric enrollment</p>
          </div>
          <button
            onClick={() => setShowEnrollmentModal(true)}
            className="px-5 py-3 bg-[#0284C7] text-white rounded-[16px] hover:bg-[#0369A1] transition-colors flex items-center gap-2 font-medium"
          >
            <Plus size={20} />
            Register New Staff
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" size={20} />
            <input
              type="text"
              placeholder="Search by name, role, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#0284C7] text-[#0F172A]"
            />
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-[16px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0F172A]">Name</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0F172A]">Role</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0F172A]">Department</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0F172A]">Contact</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0F172A]">Biometric Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0F172A]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0284C7] to-[#0369A1] flex items-center justify-center text-white font-semibold">
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-[#0F172A]">{staff.name}</p>
                        {staff.enrolledDate && (
                          <p className="text-xs text-[#64748B]">Enrolled {staff.enrolledDate}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[#0F172A]">{staff.role}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[#0F172A]">{staff.department}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-[#0F172A]">{staff.email}</p>
                      <p className="text-xs text-[#64748B]">{staff.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getBiometricStatusBadge(staff.biometricStatus)}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-[#64748B] hover:text-[#0F172A] transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredStaff.map((staff) => (
          <div key={staff.id} className="bg-white rounded-[16px] shadow-sm p-4 border border-[#E2E8F0]">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0284C7] to-[#0369A1] flex items-center justify-center text-white font-semibold flex-shrink-0">
                {staff.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#0F172A] mb-1">{staff.name}</h3>
                <p className="text-sm text-[#64748B]">{staff.role}</p>
              </div>
              <button className="text-[#64748B] hover:text-[#0F172A] transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#64748B] min-w-[80px]">Department:</span>
                <span className="text-[#0F172A] font-medium">{staff.department}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#64748B] min-w-[80px]">Email:</span>
                <span className="text-[#0F172A]">{staff.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#64748B] min-w-[80px]">Phone:</span>
                <span className="text-[#0F172A]">{staff.phone}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
              <span className="text-sm text-[#64748B]">Biometric Status</span>
              {getBiometricStatusBadge(staff.biometricStatus)}
            </div>
          </div>
        ))}
      </div>

      {/* Enrollment Modal */}
      {showEnrollmentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between rounded-t-[16px]">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-semibold text-[#0F172A]">Register New Staff</h3>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    enrollmentStep >= 1 ? 'bg-[#0284C7] text-white' : 'bg-[#F8FAFC] text-[#64748B]'
                  }`}>
                    1
                  </div>
                  <div className="w-8 h-0.5 bg-[#E2E8F0]"></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    enrollmentStep >= 2 ? 'bg-[#0284C7] text-white' : 'bg-[#F8FAFC] text-[#64748B]'
                  }`}>
                    2
                  </div>
                  <div className="w-8 h-0.5 bg-[#E2E8F0]"></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    enrollmentStep >= 3 ? 'bg-[#0284C7] text-white' : 'bg-[#F8FAFC] text-[#64748B]'
                  }`}>
                    3
                  </div>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-[#64748B] hover:text-[#0F172A] transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Step 1: Personal Information */}
              {enrollmentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-[#0F172A] mb-1">Personal Information</h4>
                    <p className="text-sm text-[#64748B]">Enter the staff member's basic details</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0F172A] mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#0284C7] text-[#0F172A]"
                        placeholder="John"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#0F172A] mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#0284C7] text-[#0F172A]"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-2">
                      Employee ID *
                    </label>
                    <input
                      type="text"
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#0284C7] text-[#0F172A]"
                      placeholder="EMP-12345"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0F172A] mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#0284C7] text-[#0F172A]"
                        placeholder="john.doe@hospital.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#0F172A] mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#0284C7] text-[#0F172A]"
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0F172A] mb-2">
                        Role *
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#0284C7] text-[#0F172A]"
                        required
                      >
                        <option value="">Select Role</option>
                        <option value="Doctor">Doctor</option>
                        <option value="Nurse">Nurse</option>
                        <option value="Surgeon">Surgeon</option>
                        <option value="Technician">Technician</option>
                        <option value="Administrator">Administrator</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#0F172A] mb-2">
                        Department *
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#0284C7] text-[#0F172A]"
                        required
                      >
                        <option value="">Select Department</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Emergency">Emergency</option>
                        <option value="Intensive Care">Intensive Care</option>
                        <option value="Surgery">Surgery</option>
                        <option value="Laboratory">Laboratory</option>
                        <option value="Administration">Administration</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Face Enrollment */}
              {enrollmentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-[#0F172A] mb-1">Biometric Enrollment</h4>
                    <p className="text-sm text-[#64748B]">Position your face within the circular guide</p>
                  </div>

                  {/* Camera View with Circular Guide */}
                  <div className="relative w-full max-w-md mx-auto aspect-square bg-[#0F172A] rounded-[16px] overflow-hidden">
                    {/* Camera Feed Simulation */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1E293B] to-[#0F172A]">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <User size={80} className="text-white/20" />
                      </div>
                    </div>

                    {/* Circular Guide Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-64 h-64">
                        {/* Outer Circle */}
                        <div className={`absolute inset-0 rounded-full border-4 transition-all duration-300 ${
                          isCapturing 
                            ? 'border-[#10B981] shadow-lg shadow-[#10B981]/50' 
                            : 'border-[#0284C7] border-dashed'
                        }`}>
                          {/* Progress Circle */}
                          {isCapturing && (
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                              <circle
                                cx="50%"
                                cy="50%"
                                r="calc(50% - 2px)"
                                fill="none"
                                stroke="#10B981"
                                strokeWidth="4"
                                strokeDasharray={`${2 * Math.PI * 126}`}
                                strokeDashoffset={`${2 * Math.PI * 126 * (1 - captureProgress / 100)}`}
                                className="transition-all duration-200"
                              />
                            </svg>
                          )}
                        </div>

                        {/* Inner Guide Markers */}
                        <div className="absolute inset-8 rounded-full border-2 border-white/30 border-dashed"></div>
                        
                        {/* Center Indicator */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          {!isCapturing ? (
                            <Camera size={48} className="text-white/60" />
                          ) : (
                            <div className="text-center">
                              <div className="w-16 h-16 rounded-full bg-[#10B981]/20 flex items-center justify-center mb-2">
                                <Camera size={32} className="text-[#10B981] animate-pulse" />
                              </div>
                              <p className="text-white text-sm font-medium">{captureProgress}%</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Text */}
                    <div className="absolute bottom-6 left-0 right-0 text-center">
                      {isCapturing ? (
                        <div className="bg-black/60 backdrop-blur-sm inline-block px-6 py-3 rounded-[8px]">
                          <p className="text-white font-medium mb-1">Capturing...</p>
                          <p className="text-white/80 text-sm">Hold still</p>
                        </div>
                      ) : (
                        <div className="bg-black/60 backdrop-blur-sm inline-block px-6 py-3 rounded-[8px]">
                          <p className="text-white font-medium">Ready to capture</p>
                          <p className="text-white/80 text-sm">Click "Start Capture" when ready</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {isCapturing && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#64748B]">Processing biometric data</span>
                        <span className="text-[#0284C7] font-semibold">{captureProgress}%</span>
                      </div>
                      <div className="h-2 bg-[#F8FAFC] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#10B981] transition-all duration-200 rounded-full"
                          style={{ width: `${captureProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Success */}
              {enrollmentStep === 3 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={48} className="text-[#10B981]" />
                  </div>
                  <h4 className="text-2xl font-semibold text-[#0F172A] mb-2">
                    Enrollment Successful!
                  </h4>
                  <p className="text-[#64748B] mb-6">
                    {formData.firstName} {formData.lastName} has been successfully registered and enrolled
                  </p>
                  <div className="bg-[#F8FAFC] rounded-[16px] p-6 max-w-md mx-auto border border-[#E2E8F0]">
                    <div className="space-y-3 text-left">
                      <div className="flex justify-between">
                        <span className="text-[#64748B]">Name:</span>
                        <span className="text-[#0F172A] font-medium">{formData.firstName} {formData.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#64748B]">Employee ID:</span>
                        <span className="text-[#0F172A] font-medium">{formData.employeeId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#64748B]">Role:</span>
                        <span className="text-[#0F172A] font-medium">{formData.role}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#64748B]">Department:</span>
                        <span className="text-[#0F172A] font-medium">{formData.department}</span>
                      </div>
                      <div className="pt-3 border-t border-[#E2E8F0] flex justify-between">
                        <span className="text-[#64748B]">Biometric Status:</span>
                        {getBiometricStatusBadge('enrolled')}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-[#E2E8F0] px-6 py-4 flex items-center justify-between rounded-b-[16px]">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-[8px] transition-colors font-medium"
              >
                Cancel
              </button>

              <div className="flex items-center gap-3">
                {enrollmentStep > 1 && enrollmentStep < 3 && (
                  <button
                    onClick={() => setEnrollmentStep(enrollmentStep - 1)}
                    className="px-5 py-2.5 text-[#0284C7] hover:bg-[#F8FAFC] rounded-[8px] transition-colors font-medium"
                  >
                    Back
                  </button>
                )}

                {enrollmentStep < 3 ? (
                  <button
                    onClick={handleNextStep}
                    disabled={enrollmentStep === 1 && (!formData.firstName || !formData.lastName || !formData.email || !formData.role || !formData.department)}
                    className="px-5 py-2.5 bg-[#0284C7] text-white rounded-[8px] hover:bg-[#0369A1] transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enrollmentStep === 1 ? 'Continue' : 'Start Capture'}
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button
                    onClick={handleComplete}
                    className="px-5 py-2.5 bg-[#10B981] text-white rounded-[8px] hover:bg-[#059669] transition-colors flex items-center gap-2 font-medium"
                  >
                    <CheckCircle2 size={20} />
                    Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
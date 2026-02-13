export const MOCK_DEPARTMENTS = [
    { id: 'mock-1', name: 'Urgencias', company_id: 'demo-org' },
    { id: 'mock-2', name: 'UCI', company_id: 'demo-org' },
    { id: 'mock-3', name: 'Pediatría', company_id: 'demo-org' },
    { id: 'mock-4', name: 'Cardiología', company_id: 'demo-org' },
    { id: 'mock-5', name: 'Radiología', company_id: 'demo-org' },
];

export const MOCK_USERS = [
    { id: 'u1', name: 'Dr. Gregory House', role: 'Médico', status: 'active', owner_id: 'demo-org', employee_id: 'DIAG-001' },
    { id: 'u2', name: 'Lisa Cuddy', role: 'Administrativo', status: 'active', owner_id: 'demo-org', employee_id: 'ADM-001' },
    { id: 'u3', name: 'James Wilson', role: 'Médico', status: 'active', owner_id: 'demo-org', employee_id: 'ONCO-001' },
    { id: 'u4', name: 'Robert Chase', role: 'Médico', status: 'active', owner_id: 'demo-org', employee_id: 'SURG-001' },
];

export const MOCK_ATTENDANCE = [
    { id: 'a1', user_id: 'u1', user_name: 'Dr. Gregory House', timestamp: new Date().toISOString(), status: 'present' },
    { id: 'a2', user_id: 'u2', user_name: 'Lisa Cuddy', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'present' },
    { id: 'a3', user_id: 'u3', user_name: 'James Wilson', timestamp: new Date(Date.now() - 7200000).toISOString(), status: 'present' },
];

export const MOCK_SETTINGS = {
    recognition_threshold: 0.65,
    dark_mode: true,
    enable_mobile_access: true,
    company_name: 'Princeton-Plainsboro Demo'
};

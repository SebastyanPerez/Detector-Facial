import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface Department {
    id: string;
    name: string;
}

interface OrgContextType {
    departments: Department[];
    hospitalName: string;
    loading: boolean;
    refreshDepartments: () => Promise<void>;
}

const OrgContext = createContext<OrgContextType | undefined>(undefined);

export function OrgProvider({ children }: { children: React.ReactNode }) {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [hospitalName] = useState('MediScan AI Central');
    const [loading, setLoading] = useState(true);

    const fetchDepartments = async () => {
        try {
            // For now, using mock data or empty list until backend CRUD is ready
            // This allows UI development to proceed without backend locks
            const mockDepts = [
                { id: '1', name: 'Urgencias' },
                { id: '2', name: 'UCI' },
                { id: '3', name: 'Pediatría' },
                { id: '4', name: 'Cardiología' },
            ];
            setDepartments(mockDepts);
        } catch (error) {
            console.error('Error fetching departments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    return (
        <OrgContext.Provider value={{ departments, hospitalName, loading, refreshDepartments: fetchDepartments }}>
            {children}
        </OrgContext.Provider>
    );
}

export function useOrg() {
    const context = useContext(OrgContext);
    if (context === undefined) {
        throw new Error('useOrg must be used within an OrgProvider');
    }
    return context;
}

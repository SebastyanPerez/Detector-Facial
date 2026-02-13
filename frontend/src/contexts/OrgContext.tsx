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
            setLoading(true);
            const response = await api.get('/api/v1/departments/');
            setDepartments(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching departments:', error);
            setDepartments([]); // Fallback to empty array
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

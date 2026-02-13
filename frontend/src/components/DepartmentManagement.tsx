import { useState } from 'react';
import { useOrg } from '../contexts/OrgContext';
import { api } from '../services/api';
import { Plus, Trash2, Building2, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function DepartmentManagement() {
    const { departments, loading, refreshDepartments } = useOrg();
    const [isAdding, setIsAdding] = useState(false);
    const [newDeptName, setNewDeptName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleAddDepartment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDeptName.trim()) return;

        setIsSubmitting(true);
        try {
            await api.post('/api/v1/departments/', { name: newDeptName });
            toast.success('Área creada correctamente');
            setNewDeptName('');
            setIsAdding(false);
            await refreshDepartments();
        } catch (error) {
            toast.error('Error al crear el área');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteDepartment = async (id: string) => {
        if (!window.confirm('¿Estás seguro de eliminar esta área?')) return;

        try {
            await api.delete(`/api/v1/departments/${id}`);
            toast.success('Área eliminada');
            await refreshDepartments();
        } catch (error) {
            toast.error('Error al eliminar el área');
        }
    };

    const filteredDepartments = departments.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)]">Gestión de Áreas</h1>
                    <p className="text-[var(--foreground-secondary)]">Administra los departamentos y sectores del hospital</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-all shadow-lg shadow-[var(--primary-glow)]"
                >
                    <Plus size={20} />
                    Nueva Área
                </button>
            </div>

            {isAdding && (
                <form
                    onSubmit={handleAddDepartment}
                    className="p-6 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl animate-in fade-in slide-in-from-top-4 duration-300"
                >
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            autoFocus
                            placeholder="Nombre del área (ej: Urgencias, UCI...)"
                            value={newDeptName}
                            onChange={(e) => setNewDeptName(e.target.value)}
                            className="flex-1 px-4 py-2 bg-[var(--secondary)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                        />
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={isSubmitting || !newDeptName.trim()}
                                className="flex-1 sm:flex-none px-6 py-2 bg-[var(--primary)] text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Guardar'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="px-6 py-2 bg-transparent border border-[var(--border)] text-[var(--foreground-secondary)] rounded-lg hover:bg-[var(--secondary)]"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </form>
            )}

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-secondary)]" size={20} />
                <input
                    type="text"
                    placeholder="Buscar áreas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-32 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl animate-pulse" />
                    ))
                ) : filteredDepartments.length > 0 ? (
                    filteredDepartments.map((dept) => (
                        <div
                            key={dept.id}
                            className="group p-6 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl hover:border-[var(--primary)] transition-all relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all">
                                <button
                                    onClick={() => handleDeleteDepartment(dept.id)}
                                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <Building2 className="text-[var(--primary)] mb-4" size={32} />
                            <h3 className="text-lg font-semibold text-[var(--foreground)]">{dept.name}</h3>
                            <p className="text-sm text-[var(--foreground-secondary)] mt-1">ID: {dept.id.slice(0, 8)}...</p>

                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[var(--primary)] opacity-[0.03] rounded-full blur-2xl group-hover:opacity-10 transition-all" />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center text-[var(--foreground-secondary)]">
                        <Building2 size={64} className="mx-auto mb-4 opacity-10" />
                        <p className="text-lg">No se encontraron áreas</p>
                    </div>
                )}
            </div>
        </div>
    );
}

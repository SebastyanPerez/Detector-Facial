import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Label } from './ui/label';
import { Save, Loader2, RefreshCw } from 'lucide-react';

interface SettingsMap {
    organization_name: string;
    recognition_threshold: number;
    email_notifications: boolean;
    realtime_alerts: boolean;
    weekly_reports: boolean;
    [key: string]: any;
}

const DEFAULTS: SettingsMap = {
    organization_name: "Mi Organización",
    recognition_threshold: 0.6,
    email_notifications: true,
    realtime_alerts: true,
    weekly_reports: false
};

export function SettingsPanel() {
    const [settings, setSettings] = useState<SettingsMap>(DEFAULTS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        try {
            const data = await api.getSettings();
            setSettings({ ...DEFAULTS, ...data });
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar configuraciones", {
                description: "Se están usando valores por defecto."
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Convert problematic types if necessary, though backend handles basic JSON types
            await api.updateSettings(settings);
            toast.success("Configuración guardada", {
                description: "Los cambios se han aplicado correctamente."
            });
        } catch (error) {
            console.error(error);
            toast.error("Error al guardar", {
                description: "No se pudieron guardar los cambios. Intenta nuevamente."
            });
        } finally {
            setSaving(false);
        }
    };

    const updateSetting = (key: keyof SettingsMap, value: any) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 p-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Configuración del Sistema</h2>
                    <p className="text-muted-foreground">Administra los parámetros globales de MediScan AI.</p>
                </div>
                <Button variant="outline" size="icon" onClick={loadSettings} disabled={saving}>
                    <RefreshCw className="h-4 w-4" />
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>General</CardTitle>
                    <CardDescription>Información básica de la organización.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="org-name">Nombre de la Organización</Label>
                        <Input
                            id="org-name"
                            value={settings.organization_name}
                            onChange={(e) => updateSetting('organization_name', e.target.value)}
                            placeholder="Ej. Hospital Santa María"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Reconocimiento Facial</CardTitle>
                    <CardDescription>Ajustes de sensibilidad y seguridad biométrica.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <Label htmlFor="threshold">Umbral de Confianza ({Math.round(settings.recognition_threshold * 100)}%)</Label>
                            <span className="text-xs text-muted-foreground">Más alto = Más estricto</span>
                        </div>
                        <Slider
                            id="threshold"
                            min={0.4}
                            max={0.9}
                            step={0.05}
                            value={[settings.recognition_threshold]}
                            onValueChange={(vals: number[]) => updateSetting('recognition_threshold', vals[0])}
                        />
                        <p className="text-xs text-muted-foreground">
                            Valor recomendado: 60%. Aumentar si hay falsos positivos. Disminuir si no reconoce a usuarios registrados.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Notificaciones y Alertas</CardTitle>
                    <CardDescription>Controla cómo y cuándo se envían las alertas.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="email-notif" className="flex flex-col space-y-1">
                            <span>Notificaciones por Email</span>
                            <span className="font-normal text-xs text-muted-foreground">Recibir resúmenes diarios.</span>
                        </Label>
                        <Switch
                            id="email-notif"
                            checked={settings.email_notifications}
                            onCheckedChange={(checked: boolean) => updateSetting('email_notifications', checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="realtime-alerts" className="flex flex-col space-y-1">
                            <span>Alertas en Tiempo Real</span>
                            <span className="font-normal text-xs text-muted-foreground">Mostrar popups cuando ingresa personal VIP o no autorizado.</span>
                        </Label>
                        <Switch
                            id="realtime-alerts"
                            checked={settings.realtime_alerts}
                            onCheckedChange={(checked: boolean) => updateSetting('realtime_alerts', checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="reports" className="flex flex-col space-y-1">
                            <span>Reportes Semanales</span>
                            <span className="font-normal text-xs text-muted-foreground">Generar PDF automático los lunes.</span>
                        </Label>
                        <Switch
                            id="reports"
                            checked={settings.weekly_reports}
                            onCheckedChange={(checked: boolean) => updateSetting('weekly_reports', checked)}
                        />
                    </div>
                </CardContent>
                <CardFooter className="bg-muted/50 p-4 flex justify-end rounded-b-lg">
                    <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Guardar Cambios
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

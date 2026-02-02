import { useState, useEffect, useRef } from 'react';
import { Scan, CheckCircle2, XCircle, Clock, User, Power, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../services/api';

type ScanStatus = 'idle' | 'scanning' | 'success' | 'error';

interface RecentActivity {
  id: string | number;
  name: string;
  role: string;
  time: string;
  status: 'success' | 'error';
}

export function ScannerView() {
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
  const [scanResult, setScanResult] = useState<{ name: string; time: string } | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [cameraActive, setCameraActive] = useState(true);
  const [autoScan, setAutoScan] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const autoScanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Iniciar cámara
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        if (cameraActive) {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setCameraActive(false);
        toast.error('No se pudo acceder a la cámara');
      }
    };

    if (cameraActive) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraActive]);

  // Auto-scan cada 5 segundos
  useEffect(() => {
    if (autoScan && cameraActive && scanStatus === 'idle') {
      autoScanIntervalRef.current = setInterval(() => {
        if (videoRef.current && canvasRef.current) {
          startScan();
        }
      }, 5000);
    }

    return () => {
      if (autoScanIntervalRef.current) {
        clearInterval(autoScanIntervalRef.current);
      }
    };
  }, [autoScan, cameraActive, scanStatus]);

  const startScan = async () => {
    if (!videoRef.current || !canvasRef.current || !cameraActive) return;

    setScanStatus('scanning');
    setScanResult(null);

    const context = canvasRef.current.getContext('2d');
    if (context && videoRef.current) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);

      const imageData = canvasRef.current.toDataURL('image/jpeg');

      try {
        const base64Image = imageData.split(',')[1];
        const result = await api.recognizeFace(base64Image);

        if (result.recognized) {
          const time = new Date().toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });

          setScanStatus('success');
          setScanResult({ name: result.name || 'Desconocido', time });

          const newActivity: RecentActivity = {
            id: Date.now(),
            name: result.name || 'Desconocido',
            role: result.role || 'Staff',
            time,
            status: 'success'
          };
          setRecentActivity(prev => [newActivity, ...prev.slice(0, 9)]);

          setRecentActivity(prev => [newActivity, ...prev.slice(0, 9)]);

          toast.success(`Personal identificado: ${result.name}`);
          setTimeout(() => setScanStatus('idle'), 3000);
        } else {
          setScanStatus('error');
          toast.error('Rostro no reconocido');
          setTimeout(() => setScanStatus('idle'), 3000);
        }
      } catch (error) {
        console.error("Scan error:", error);
        setScanStatus('error');
        setTimeout(() => setScanStatus('idle'), 3000);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[var(--card)] rounded-xl shadow-sm p-6 border border-[var(--border)]">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--foreground)]">Validación de Escáner</h2>
            <p className="text-[var(--foreground-secondary)] mt-1">Escanea empleados automáticamente cada 5 segundos</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${cameraActive
              ? 'bg-green-100 border-green-300'
              : 'bg-red-100 border-red-300'
              }`}>
              <div className={`w-2 h-2 rounded-full ${cameraActive ? 'bg-green-600 animate-pulse' : 'bg-red-600'}`}></div>
              <span className={`text-sm font-medium ${cameraActive ? 'text-green-700' : 'text-red-700'}`}>
                {cameraActive ? 'Cámara Activa' : 'Cámara Inactiva'}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <button
            onClick={() => setCameraActive(!cameraActive)}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${cameraActive
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
          >
            <Power size={18} />
            {cameraActive ? 'Apagar Cámara' : 'Encender Cámara'}
          </button>

          <label className="flex items-center gap-2 px-4 py-2 bg-[var(--secondary)] border border-[var(--border)] rounded-lg cursor-pointer hover:bg-opacity-80 transition-all">
            <input
              type="checkbox"
              checked={autoScan}
              onChange={(e) => setAutoScan(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-[var(--foreground)]">Escaneo Automático</span>
          </label>
        </div>
      </div>

      {/* Camera Viewport */}
      <div className="bg-[var(--card)] rounded-xl shadow-sm overflow-hidden border border-[var(--border)]">
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
          {cameraActive ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Face Guide Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="border-2 border-white/30 w-64 h-80 rounded-[50%] relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    Posicione su rostro aquí
                  </div>
                </div>
              </div>

              {/* Scanning Reticle & Animation */}
              {scanStatus === 'scanning' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-72 h-72">
                    <div className="absolute top-0 left-0 w-full h-full border-2 border-[var(--primary)] rounded-lg animate-pulse opacity-50"></div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-[var(--primary)] shadow-[0_0_15px_var(--primary)] animate-[scan_2s_ease-in-out_infinite]"></div>
                  </div>
                </div>
              )}

              {/* Success */}
              {scanStatus === 'success' && scanResult && (
                <div className="absolute inset-0 bg-green-600/30 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <CheckCircle2 size={64} className="text-green-400 mx-auto mb-4 animate-bounce" />
                    <p className="text-white text-xl font-semibold">{scanResult.name}</p>
                    <p className="text-white/80 text-sm mt-1">{scanResult.time}</p>
                  </div>
                </div>
              )}

              {/* Error */}
              {scanStatus === 'error' && (
                <div className="absolute inset-0 bg-red-600/30 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <XCircle size={64} className="text-red-400 mx-auto mb-4" />
                    <p className="text-white text-xl font-semibold">No Detectado</p>
                    <p className="text-white/80 text-sm mt-1">Intenta de nuevo</p>
                  </div>
                </div>
              )}

              {/* Manual Scan Button */}
              {scanStatus === 'idle' && !autoScan && (
                <div className="absolute inset-x-0 bottom-8 flex items-center justify-center">
                  <button
                    onClick={startScan}
                    className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-all shadow-lg flex items-center gap-2 font-medium"
                  >
                    <Scan size={20} />
                    Escanear
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center flex-col gap-4 bg-[var(--secondary)]">
              <Camera size={64} className="text-[var(--foreground-secondary)] opacity-50" />
              <p className="text-[var(--foreground-secondary)]">Cámara apagada</p>
            </div>
          )}
        </div>
      </div>

      {/* Activity Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Current Status Card */}
        <div className="bg-[var(--card)] rounded-xl shadow-sm p-6 border border-[var(--border)]">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Estado Actual</h3>
          <div className="text-center py-6">
            {scanStatus === 'idle' && (
              <div>
                <Scan className="text-[var(--primary)] mx-auto mb-3" size={32} />
                <p className="text-[var(--foreground-secondary)]">Listo para escanear</p>
              </div>
            )}
            {scanStatus === 'scanning' && (
              <div>
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
                <p className="text-[var(--primary)] mt-3 font-medium">Escaneando...</p>
              </div>
            )}
            {scanStatus === 'success' && scanResult && (
              <div>
                <CheckCircle2 className="text-green-600 mx-auto mb-3" size={32} />
                <p className="text-green-600 font-bold text-lg">{scanResult.name}</p>
                <p className="text-[var(--foreground-secondary)] text-sm mt-1">{scanResult.time}</p>
              </div>
            )}
            {scanStatus === 'error' && (
              <div>
                <XCircle className="text-red-600 mx-auto mb-3" size={32} />
                <p className="text-red-600 font-medium">No Detectado</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Detections */}
        <div className="lg:col-span-2 bg-[var(--card)] rounded-xl shadow-sm overflow-hidden border border-[var(--border)]">
          <div className="p-6 border-b border-[var(--border)]">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Detecciones Recientes</h3>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {recentActivity.length === 0 ? (
              <div className="p-6 text-center text-[var(--foreground-secondary)]">
                <Clock size={24} className="mx-auto mb-2 opacity-50" />
                <p>Sin detecciones aún</p>
              </div>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-[var(--secondary)] transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                        {activity.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--foreground)]">{activity.name}</p>
                        <p className="text-xs text-[var(--foreground-secondary)]">{activity.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[var(--foreground)]">{activity.time}</p>
                      {activity.status === 'success' ? (
                        <CheckCircle2 size={18} className="text-green-600 ml-auto" />
                      ) : (
                        <XCircle size={18} className="text-red-600 ml-auto" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
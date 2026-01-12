import { useState, useEffect, useRef } from 'react';
import { Scan, CheckCircle2, XCircle, Clock, User } from 'lucide-react';
import { api } from '../services/api';

type ScanStatus = 'idle' | 'scanning' | 'success' | 'error';

interface RecentActivity {
  id: number;
  name: string;
  role: string;
  time: string;
  status: 'success' | 'error';
}

export function ScannerView() {
  // --- EDUCATIONAL COMMENT: Estado del componente (State) ---
  // useState permite guardar datos que pueden cambiar con el tiempo.
  // Cuando scanStatus cambia, React actualiza (re-renderiza) la interfaz.
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
  const [scanResult, setScanResult] = useState<{ name: string; time: string } | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  // --- EDUCATIONAL COMMENT: Referencias (Refs) ---
  // useRef se usa para acceder directamente a elementos del DOM (HTML).
  // Aquí necesitamos acceder al elemento <video> para ponerle el stream de la cámara,
  // y al elemento <canvas> para tomar la foto.
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- EDUCATIONAL COMMENT: Efectos Secundarios (Effects) ---
  // useEffect se ejecuta cuando el componente se "monta" (aparece en pantalla).
  // Aquí lo usamos para iniciar la cámara automáticamente.
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        // Pedimos permiso al navegador para usar la cámara
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          // Conectamos el video de la cámara al elemento <video> de HTML
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    startCamera();

    // Función de limpieza: se ejecuta cuando el componente se desmonta.
    // Es importante apagar la cámara para no dejarla prendida en segundo plano.
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // [] vacío significa que solo se ejecuta una vez al inicio.

  const startScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setScanStatus('scanning');
    setScanResult(null);

    // Capture frame
    // Usamos el Canvas API para "dibujar" el frame actual del video y convertirlo a imagen
    const context = canvasRef.current.getContext('2d');
    if (context && videoRef.current) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);

      // Convertimos el canvas a una cadena Base64 (texto que representa la imagen)
      const imageData = canvasRef.current.toDataURL('image/jpeg');

      try {
        // --- EDUCATIONAL COMMENT: Llamada a la API ---
        // Enviamos la imagen al backend y esperamos (await) la respuesta.
        // imageData.split(',')[1] quita el prefijo "data:image/jpeg;base64,"
        const base64Image = imageData.split(',')[1];
        const result = await api.recognizeFace(base64Image);

        if (result.recognized) {
          const time = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });

          setScanStatus('success');
          setScanResult({ name: result.name || 'Unknown', time });

          // Add to local activity log (optimistic update)
          const newActivity: RecentActivity = {
            id: Date.now(),
            name: result.name || 'Unknown',
            role: 'Staff', // We might need to fetch role separately
            time,
            status: 'success'
          };
          setRecentActivity(prev => [newActivity, ...prev.slice(0, 3)]);

          setTimeout(() => setScanStatus('idle'), 3000);
        } else {
          setScanStatus('error');
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
      {/* Camera Viewport Section */}
      <div className="bg-[var(--card)] rounded-2xl shadow-sm overflow-hidden border border-[var(--border)]">
        <div className="p-6 border-b border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[var(--foreground)]">Facial Recognition Scanner</h2>
              <p className="text-[var(--foreground-secondary)] mt-1">Position your face within the frame for identification</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--secondary)] rounded-xl border border-[var(--border)]">
              <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse"></div>
              <span className="text-sm font-medium text-[var(--foreground)]">Camera Active</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* 16:9 Camera Viewport */}
          <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border-2 border-[var(--border)]">

            {/* Real Camera Feed */}
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
            />

            {/* Hidden Canvas for Capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Scanning Reticle Overlay */}
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${scanStatus === 'scanning' ? 'opacity-100' : 'opacity-0'
              }`}>
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent animate-scan"></div>
                </div>
                {/* Corner Brackets */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[var(--primary)] rounded-tl-2xl"></div>
                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[var(--primary)] rounded-tr-2xl"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[var(--primary)] rounded-bl-2xl"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[var(--primary)] rounded-br-2xl"></div>
              </div>
            </div>

            {/* Success Overlay */}
            <div className={`absolute inset-0 bg-[var(--success)]/20 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${scanStatus === 'success' ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}>
              <div className="text-center">
                <CheckCircle2 size={64} className="text-[var(--success)] mx-auto mb-4 animate-scale-in" />
                <p className="text-white text-xl font-semibold">Recognition Successful</p>
                {scanResult && <p className="text-white/90 text-lg mt-2">{scanResult.name}</p>}
              </div>
            </div>

            {/* Error Overlay */}
            <div className={`absolute inset-0 bg-[var(--destructive)]/20 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${scanStatus === 'error' ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}>
              <div className="text-center">
                <XCircle size={64} className="text-[var(--destructive)] mx-auto mb-4 animate-scale-in" />
                <p className="text-white text-xl font-semibold">Recognition Failed</p>
                <p className="text-white/80 text-sm mt-2">Please try again</p>
              </div>
            </div>

            {/* Scan Button Overlay - Always visible unless scanning/success/error to allow re-scan */}
            {scanStatus === 'idle' && (
              <div className="absolute inset-x-0 bottom-8 flex items-center justify-center z-10">
                <button
                  onClick={startScan}
                  className="px-8 py-4 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-hover)] transition-all shadow-lg flex items-center gap-3 text-lg font-medium"
                >
                  <Scan size={24} />
                  Scan Face
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Status Card */}
        <div className="bg-[var(--card)] rounded-2xl shadow-sm overflow-hidden border border-[var(--border)]">
          <div className="p-6 border-b border-[var(--border)]">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Current Status</h3>
          </div>
          <div className="p-6">
            {scanStatus === 'idle' && (
              <div className="text-center py-8">
                <Scan className="text-[var(--foreground-secondary)] mx-auto mb-4" size={32} />
                <p className="text-[var(--foreground-secondary)]">Ready to scan</p>
              </div>
            )}
            {scanStatus === 'scanning' && (
              <div className="text-center py-8">
                <p className="text-[var(--primary)] animate-pulse">Scanning...</p>
              </div>
            )}
            {scanStatus === 'success' && scanResult && (
              <div className="text-center py-8">
                <p className="text-[var(--success)] font-bold text-xl">{scanResult.name}</p>
                <p className="text-[var(--foreground-secondary)]">Checked in at {scanResult.time}</p>
              </div>
            )}
            {scanStatus === 'error' && (
              <div className="text-center py-8">
                <p className="text-[var(--destructive)]">Not Recognized</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Feed */}
        <div className="bg-[var(--card)] rounded-2xl shadow-sm overflow-hidden border border-[var(--border)]">
          <div className="p-6 border-b border-[var(--border)]">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Recent Activity</h3>
          </div>
          <div className="p-6 space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={activity.id} className="flex items-center gap-4 p-4 bg-[var(--secondary)] rounded-xl border border-[var(--border)]">
                <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white">
                  {activity.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[var(--foreground)]">{activity.name}</p>
                  <p className="text-sm text-[var(--foreground-secondary)]">{activity.time}</p>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <p className="text-center text-[var(--foreground-secondary)]">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(320px); }
        }
        @keyframes scale-in {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scan { animation: scan 2s linear infinite; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}
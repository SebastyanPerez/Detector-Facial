"""
Aplicación de escritorio para reconocimiento facial.
Interfaz gráfica usando Tkinter.
"""

import tkinter as tk
from tkinter import messagebox, simpledialog, scrolledtext
from face_recognizer import FaceRecognizer
from datetime import datetime
import threading


class AttendanceApp:
    """
    Aplicación principal de escritorio para reconocimiento facial y asistencia.
    """
    
    def __init__(self, root):
        self.root = root
        self.root.title("Sistema de Asistencia con Reconocimiento Facial")
        self.root.geometry("700x650")
        self.root.resizable(False, False)
        
        # Inicializar el reconocedor facial
        self.recognizer = FaceRecognizer()
        
        # Historial de asistencia (simulación)
        self.attendance_log = []
        
        # Crear la interfaz
        self.create_widgets()
        
        # Actualizar información inicial
        self.update_status()
        
        # Refrescar lista de personas registradas
        self.refresh_registered_list()
    
    def create_widgets(self):
        """Crea y organiza los widgets de la interfaz"""
        
        # Título
        title_label = tk.Label(
            self.root, 
            text="Sistema de Asistencia Facial",
            font=("Arial", 18, "bold"),
            pady=20
        )
        title_label.pack()
        
        # Frame para botones principales
        button_frame = tk.Frame(self.root, pady=20)
        button_frame.pack()
        
        # Botón: Registrar Rostro
        self.register_btn = tk.Button(
            button_frame,
            text="📷 Registrar Rostro",
            font=("Arial", 12),
            bg="#4CAF50",
            fg="white",
            width=20,
            height=2,
            command=self.register_face
        )
        self.register_btn.pack(pady=10)
        
        # Botón: Reconocer Rostro
        self.recognize_btn = tk.Button(
            button_frame,
            text="🔍 Reconocer Rostro",
            font=("Arial", 12),
            bg="#2196F3",
            fg="white",
            width=20,
            height=2,
            command=self.recognize_face
        )
        self.recognize_btn.pack(pady=10)
        
        # Botón: Marcar Asistencia
        self.attendance_btn = tk.Button(
            button_frame,
            text="✅ Marcar Asistencia",
            font=("Arial", 12),
            bg="#FF9800",
            fg="white",
            width=20,
            height=2,
            command=self.mark_attendance
        )
        self.attendance_btn.pack(pady=10)
        
        # Frame principal con dos columnas
        main_frame = tk.Frame(self.root, pady=10)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=20)
        
        # Columna izquierda: Lista de personas registradas
        left_frame = tk.Frame(main_frame)
        left_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(0, 10))
        
        # Título de la lista
        list_title = tk.Label(
            left_frame,
            text="Personas Registradas",
            font=("Arial", 11, "bold"),
            anchor="w"
        )
        list_title.pack(fill=tk.X, pady=(0, 5))
        
        # Frame para la lista con scrollbar
        list_container = tk.Frame(left_frame)
        list_container.pack(fill=tk.BOTH, expand=True)
        
        # Listbox con scrollbar
        scrollbar = tk.Scrollbar(list_container)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        self.registered_listbox = tk.Listbox(
            list_container,
            yscrollcommand=scrollbar.set,
            font=("Arial", 10),
            height=8
        )
        self.registered_listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.config(command=self.registered_listbox.yview)
        
        # Frame para botones de la lista
        list_buttons_frame = tk.Frame(left_frame)
        list_buttons_frame.pack(fill=tk.X, pady=(5, 0))
        
        # Botón para eliminar persona seleccionada
        self.delete_btn = tk.Button(
            list_buttons_frame,
            text="🗑️ Eliminar Seleccionado",
            font=("Arial", 9),
            bg="#f44336",
            fg="white",
            command=self.delete_selected_face,
            state=tk.DISABLED
        )
        self.delete_btn.pack(side=tk.LEFT, padx=(0, 5), fill=tk.X, expand=True)
        
        # Botón para refrescar lista
        refresh_btn = tk.Button(
            list_buttons_frame,
            text="🔄 Actualizar",
            font=("Arial", 9),
            bg="#2196F3",
            fg="white",
            command=self.refresh_registered_list
        )
        refresh_btn.pack(side=tk.LEFT, fill=tk.X, expand=True)
        
        # Bind evento de selección
        self.registered_listbox.bind('<<ListboxSelect>>', self.on_listbox_select)
        
        # Columna derecha: Información y logs
        right_frame = tk.Frame(main_frame)
        right_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True)
        
        # Etiqueta de estado
        self.status_label = tk.Label(
            right_frame,
            text="Estado: Inicializando...",
            font=("Arial", 10),
            anchor="w"
        )
        self.status_label.pack(fill=tk.X, pady=(0, 5))
        
        # Frame para información
        info_frame = tk.Frame(right_frame)
        info_frame.pack(fill=tk.BOTH, expand=True)
        
        # Área de texto para logs
        log_label = tk.Label(
            info_frame,
            text="Registro de Actividad:",
            font=("Arial", 10, "bold"),
            anchor="w"
        )
        log_label.pack(fill=tk.X, pady=(0, 5))
        
        self.log_text = scrolledtext.ScrolledText(
            info_frame,
            height=8,
            width=35,
            font=("Consolas", 9),
            wrap=tk.WORD
        )
        self.log_text.pack(fill=tk.BOTH, expand=True)
        
        # Botón para limpiar logs
        clear_btn = tk.Button(
            info_frame,
            text="Limpiar Logs",
            command=self.clear_logs,
            font=("Arial", 9)
        )
        clear_btn.pack(pady=5)
    
    def log_message(self, message: str):
        """Agrega un mensaje al log con timestamp"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] {message}\n"
        self.log_text.insert(tk.END, log_entry)
        self.log_text.see(tk.END)
        self.root.update()
    
    def clear_logs(self):
        """Limpia el área de logs"""
        self.log_text.delete(1.0, tk.END)
    
    def update_status(self):
        """Actualiza la etiqueta de estado y la lista de personas"""
        count = self.recognizer.get_registered_count()
        self.status_label.config(
            text=f"Estado: {count} rostro(s) registrado(s)"
        )
        self.refresh_registered_list()
    
    def refresh_registered_list(self):
        """Actualiza la lista de personas registradas"""
        self.registered_listbox.delete(0, tk.END)
        names = self.recognizer.get_registered_names()
        for name in names:
            self.registered_listbox.insert(tk.END, name)
        
        # Deshabilitar botón de eliminar si no hay selección
        if self.registered_listbox.size() == 0:
            self.delete_btn.config(state=tk.DISABLED)
    
    def on_listbox_select(self, event):
        """Maneja la selección en la lista"""
        selection = self.registered_listbox.curselection()
        if selection:
            self.delete_btn.config(state=tk.NORMAL)
        else:
            self.delete_btn.config(state=tk.DISABLED)
    
    def delete_selected_face(self):
        """Elimina la persona seleccionada de la lista"""
        selection = self.registered_listbox.curselection()
        if not selection:
            messagebox.showwarning("Advertencia", "Por favor selecciona una persona de la lista")
            return
        
        # Obtener el nombre seleccionado
        index = selection[0]
        name = self.registered_listbox.get(index)
        
        # Confirmar eliminación
        confirm = messagebox.askyesno(
            "Confirmar Eliminación",
            f"¿Estás seguro de que deseas eliminar a '{name}'?\n\nEsta acción no se puede deshacer."
        )
        
        if not confirm:
            return
        
        # Eliminar el rostro
        success, message = self.recognizer.delete_face(name)
        
        if success:
            self.log_message(f"✓ {message}")
            self.update_status()
            messagebox.showinfo("Éxito", message)
        else:
            self.log_message(f"✗ {message}")
            messagebox.showerror("Error", message)
    
    def register_face(self):
        """Maneja el registro de un nuevo rostro"""
        # Pedir nombre al usuario
        name = simpledialog.askstring(
            "Registrar Rostro",
            "Ingresa el nombre de la persona:",
            parent=self.root
        )
        
        if not name:
            return
        
        if not name.strip():
            messagebox.showwarning("Advertencia", "El nombre no puede estar vacío")
            return
        
        # Deshabilitar botón durante el proceso
        self.register_btn.config(state=tk.DISABLED)
        self.log_message(f"Iniciando registro automático para: {name}")
        
        # Ejecutar en un hilo separado para no bloquear la UI
        def register_thread():
            try:
                success, message = self.recognizer.register_face(name)
                self.root.after(0, lambda: self.register_callback(success, message))
            except Exception as e:
                self.root.after(0, lambda: self.register_callback(False, f"Error: {str(e)}"))
        
        thread = threading.Thread(target=register_thread, daemon=True)
        thread.start()
    
    def register_callback(self, success: bool, message: str):
        """Callback después de intentar registrar un rostro"""
        self.register_btn.config(state=tk.NORMAL)
        self.update_status()
        
        if success:
            self.log_message(f"✓ {message}")
            messagebox.showinfo("Éxito", message)
        else:
            self.log_message(f"✗ {message}")
            messagebox.showerror("Error", message)
    
    def recognize_face(self):
        """Maneja el reconocimiento de rostro"""
        if self.recognizer.get_registered_count() == 0:
            messagebox.showwarning(
                "Advertencia",
                "No hay rostros registrados. Por favor registra al menos un rostro primero."
            )
            return
        
        # Deshabilitar botón durante el proceso
        self.recognize_btn.config(state=tk.DISABLED)
        self.log_message("Iniciando reconocimiento facial automático...")
        
        # Ejecutar en un hilo separado
        def recognize_thread():
            try:
                recognized, name, confidence = self.recognizer.recognize_face(
                    auto_recognize=True, 
                    confidence_threshold=0.90, 
                    min_confidence_frames=10
                )
                self.root.after(0, lambda: self.recognize_callback(recognized, name, confidence))
            except Exception as e:
                self.root.after(0, lambda: self.recognize_callback(False, None, 0.0, str(e)))
        
        thread = threading.Thread(target=recognize_thread, daemon=True)
        thread.start()
    
    def recognize_callback(self, recognized: bool, name: str, confidence: float, error: str = None):
        """Callback después de intentar reconocer un rostro"""
        self.recognize_btn.config(state=tk.NORMAL)
        
        if error:
            self.log_message(f"✗ Error en reconocimiento: {error}")
            messagebox.showerror("Error", f"Error durante el reconocimiento: {error}")
            return
        
        if recognized:
            self.log_message(f"✓ Rostro reconocido: {name} (Confianza: {confidence:.2%})")
            messagebox.showinfo(
                "Reconocido",
                f"Rostro reconocido: {name}\nConfianza: {confidence:.2%}"
            )
        else:
            self.log_message("✗ Rostro no reconocido")
            messagebox.showwarning("No reconocido", "El rostro no coincide con ningún registro")
    
    def mark_attendance(self):
        """Simula el marcado de asistencia"""
        if self.recognizer.get_registered_count() == 0:
            messagebox.showwarning(
                "Advertencia",
                "No hay rostros registrados. Por favor registra al menos un rostro primero."
            )
            return
        
        # Deshabilitar botón durante el proceso
        self.attendance_btn.config(state=tk.DISABLED)
        self.log_message("Marcando asistencia automáticamente...")
        
        # Ejecutar en un hilo separado
        def attendance_thread():
            try:
                recognized, name, confidence = self.recognizer.recognize_face(
                    auto_recognize=True, 
                    confidence_threshold=0.90, 
                    min_confidence_frames=10
                )
                self.root.after(0, lambda: self.attendance_callback(recognized, name, confidence))
            except Exception as e:
                self.root.after(0, lambda: self.attendance_callback(False, None, 0.0, str(e)))
        
        thread = threading.Thread(target=attendance_thread, daemon=True)
        thread.start()
    
    def attendance_callback(self, recognized: bool, name: str, confidence: float, error: str = None):
        """Callback después de intentar marcar asistencia"""
        self.attendance_btn.config(state=tk.NORMAL)
        
        if error:
            self.log_message(f"✗ Error al marcar asistencia: {error}")
            messagebox.showerror("Error", f"Error al marcar asistencia: {error}")
            return
        
        if recognized:
            # Registrar asistencia
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            attendance_record = {
                'name': name,
                'timestamp': timestamp,
                'confidence': confidence
            }
            self.attendance_log.append(attendance_record)
            
            self.log_message(f"✓ Asistencia marcada: {name} a las {timestamp}")
            messagebox.showinfo(
                "Asistencia Registrada",
                f"✓ {name}\nAsistencia marcada exitosamente\nConfianza: {confidence:.2%}"
            )
        else:
            self.log_message("✗ No se pudo marcar asistencia: rostro no reconocido")
            messagebox.showwarning(
                "Asistencia No Registrada",
                "El rostro no fue reconocido. No se puede marcar asistencia."
            )


def main():
    """Función principal para ejecutar la aplicación"""
    root = tk.Tk()
    app = AttendanceApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()

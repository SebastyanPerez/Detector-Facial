# 🎓 Guide: Understanding the Frontend Code

This document explains the key concepts used in the "MediScan AI" frontend, designed to help you understand how React and TypeScript work together with the Python backend.

## 1. Project Structure

- **`src/components/`**: Contains the visual building blocks (Buttons, Scanners, Dashboards).
- **`src/services/`**: Contains `api.ts`, which acts as the "bridge" between Frontend and Backend.
- **`src/App.tsx`**: The main entry point that decides which screen to show (Landing or Dashboard).

## 2. Key React Concepts

### Components (Componentes)
Think of components as custom HTML tags. Instead of writing `<div>...</div>` everywhere, we write `<ScannerView />` or `<EnhancedDashboard />`.

### Hooks (Ganchos)
Hooks allow components to have "superpowers" like memory or side effects.

- **`useState` (Memory)**:
  - Allows the component to "remember" things.
  - Example: `const [scanStatus, setScanStatus] = useState('idle');`
  - When `setScanStatus` is called, React "repaints" the screen with the new status (changing from a scan button to a success message).

- **`useEffect` (Automation)**:
  - Runs code automatically when the component appears or when a variable changes.
  - Example: "When the component loads, turn on the specific camera."
  - Example: "When I switch to the 'Logs' tab, fetch the data from the database."

- **`useRef` (Direct Access)**:
  - Allows us to touch the actual DOM elements (HTML).
  - Essential for the `<video>` element (to show the camera) and the `<canvas>` element (to grab a picture frame).

## 3. How the Scanner Works (`ScannerView.tsx`)

1.  **Start Camera**: `useEffect` calls `navigator.mediaDevices.getUserMedia` to ask for the webcam stream.
2.  **Display Stream**: We attach that stream to a hidden `<video>` element.
3.  **Capture Frame**: When you click scan, we draw the current video frame onto a `<canvas>`.
4.  **Process Image**:
    - We convert the canvas drawing to a **Base64** string (text representation of an image).
    - We remove the header (`data:image/jpeg;base64,`) because the backend just wants the raw code.
5.  **Send to API**: We pass this string to `api.recognizeFace()`.

## 4. How the Dashboard Works (`EnhancedDashboard.tsx`)

1.  **Tabs**: We use `activeTab` state to know if we are showing 'scanner', 'staff', 'logs', or 'settings'.
2.  **Fetching Data**:
    - Inside `useEffect`, we check: `if (activeTab === 'logs')`.
    - If true, we call `api.getAttendance()`.
    - We wait for the answer (`await` or `.then()`) and save it to the `logs` state.
3.  **Displaying List**:
    - We use `.map()` to loop through the `logs` array and create an HTML element for each one.

## 5. API Communication (`services/api.ts`)

We use a library called **Axios**. It's like a messenger.
- **Frontend**: "Axios, take this photo to `http://localhost:8000/api/v1/face/recognize`."
- **Axios**: *Runs to the Python backend...*
- **Backend**: *Processes image, saves to DB, returns JSON.*
- **Axios**: *Returns to Frontend with the answer.*
- **Frontend**: "Great, I'll update the screen!"

## 6. TypeScript

You'll see things like `interface RecentActivity` or `type ScanStatus`.
This is TypeScript helping us avoid mistakes. It forces us to define *exactly* what a "Log" looks like (id, name, time), so we don't accidentally try to access `log.phoneNumber` if it doesn't exist.

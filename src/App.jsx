import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDentists from "./pages/admin/AdminDentists";
import AdminHospitalDentists from "./pages/admin/AdminHospitalDentists";
import AdminHospitals from "./pages/admin/AdminHospitals";
import AdminAppointments from "./pages/admin/AdminAppointments";
import LoginScreen from "./pages/LoginScreen";
import PatientAppointments from "./pages/patient/PatientAppointments";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientHospital from "./pages/patient/PatientHospital";
import PatientHospitalList from "./pages/patient/PatientHospitalList";
import PatientRecords from "./pages/patient/PatientRecords";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginScreen />} />

      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/hospitals"
        element={
          <ProtectedRoute>
            <PatientHospitalList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/hospital/:id"
        element={
          <ProtectedRoute>
            <PatientHospital />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/appointments"
        element={
          <ProtectedRoute>
            <PatientAppointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/records"
        element={
          <ProtectedRoute>
            <PatientRecords />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/registry"
        element={
          <ProtectedRoute role="admin">
            <AdminAppointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/hospitals"
        element={
          <ProtectedRoute role="admin">
            <AdminHospitals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/hospitals/:hospitalId/dentists"
        element={
          <ProtectedRoute role="admin">
            <AdminHospitalDentists />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dentists"
        element={
          <ProtectedRoute role="admin">
            <AdminDentists />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/dentists/*" element={<Navigate to="/admin/dentists" replace />} />
      <Route path="/admin/dentist" element={<Navigate to="/admin/dentists" replace />} />
      <Route path="/admin/appointments" element={<Navigate to="/admin/registry" replace />} />
      <Route path="/admin/appointments/*" element={<Navigate to="/admin/registry" replace />} />
      <Route path="/admin/appointment" element={<Navigate to="/admin/registry" replace />} />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

      <Route path="/patient/hospital" element={<Navigate to="/patient/hospitals" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

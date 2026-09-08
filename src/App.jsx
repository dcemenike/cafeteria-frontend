import { Routes, Route } from 'react-router-dom';
import CustomerMenu from './pages/CustomerMenu';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Routes>

      <Route path="/" element={<CustomerMenu />} />
      <Route path="/admin/signup" element={<SignUp />} />
      <Route path="/admin/signin" element={<SignIn />} />
      <Route path="/admin/dashboard" element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      } />

    </Routes>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './Components/MainLayout/MainLayout';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import MyProfile from './pages/MyProfile/MyProfile';
import Admin from './pages/Admin/Admin';
import ProtectedRoute from './Components/ProtectedRoute';
import AdminUsers from './pages/AdminUsers/AdminUsers';
import HealthPanel from './pages/HealthPanel/HealthPanel';


function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          <Route
            path="/my-profile"
            element={
              <ProtectedRoute>
                <MyProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/health"
          element={<HealthPanel />}
        />
      </Routes>
    </Router >
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './Components/MainLayout/MainLayout';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import MyProfile from './pages/MyProfile/MyProfile';
import Admin from './pages/Admin/Admin';
import ProtectedRoute from './Components/ProtectedRoute';
import AdminUsers from './pages/AdminUsers/AdminUsers';
import ProgressSection from "./pages/Progress/Progress";
import Calories from "./pages/Calories/Calories";
import Products from "./pages/Products/Products";
import MealsSection from "./Components/MealsSection/MealsSection";
import MealsPrintView from "./Components/MealsPrinView/MealsPrintView";




function App() {

  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />

          <Route
            path="/meals"
            element={
              <ProtectedRoute>
                <MealsSection />
              </ProtectedRoute>
            }
          />

          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <ProgressSection />
              </ProtectedRoute>
            }
          />

          <Route
            path="/calories"
            element={
              <ProtectedRoute>
                <Calories />
              </ProtectedRoute>
            }
          />

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
          path="/meals/print"
          element={<MealsPrintView />} />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

      </Routes>
    </Router >
  );
}

export default App;

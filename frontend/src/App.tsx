import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.tsx';
import PageNotFound from './pages/PageNotFound.tsx';
import Register from './pages/Register.tsx';
import Logout from '@/pages/Logout.tsx';
import ProtectedRoute from '@/components/ProtextedRoute.tsx';
import Dashboard from '@/pages/Dashboard/Dashboard.tsx';
import Teams from '@/pages/Dashboard/TeamList.tsx';
import Users from '@/pages/Dashboard/Users.tsx';
import TeamDetails from '@/pages/Dashboard/TeamDetails.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path={'/teams'} element={<Teams />} />
          <Route path={'/team/:id'} element={<TeamDetails />} />
          <Route path={'/users'} element={<Users />} />
        </Route>

        {/*Login, Logout, Register, and PageNotFound routes*/}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

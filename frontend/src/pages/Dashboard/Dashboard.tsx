import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.tsx';
import { Link, Outlet } from 'react-router-dom';

function NavBar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to={'/teams'}>Teams</Link>
        </li>
        <li>
          <Link to={'/users'}>Users</Link>
        </li>
      </ul>
    </nav>
  );
}

const Dashboard: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null;
  }

  const { user, logout } = authContext;

  return (
    <div>
      <header>Header</header>
      <>
        <NavBar />
        <main>
          <h1>Dashboard</h1>
          <p>Welcome {user?.username}</p>
          <Outlet />
        </main>
      </>

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;

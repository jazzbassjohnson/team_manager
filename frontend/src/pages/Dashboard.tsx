import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function NavBar() {
  return (
    <nav>
      <ul>
        <li>
          <a href="/dashboard">Dashboard</a>
        </li>
        <li>
          <a href="/profile">Profile</a>
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
        </main>
      </>

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;


import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const authContext = useContext(AuthContext);
  
  if (!authContext){
    return null
  }
  
  const { user, logout } = authContext

  return (
      <div>
          <h1>Welcome, {user.username}</h1>
          <button onClick={logout}>Logout</button>
      </div>
  );
};

export default Dashboard;

// src/pages/Dashboard/TeamList.tsx
import React, { useEffect, useState } from 'react';
import { getTeams } from '@/api/teams.ts';
import { Link } from 'react-router-dom';

interface Team {
  id: number;
  name: string;
  // add other relevant fields
}

const TeamList: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await getTeams();
        setTeams(response.data);
      } catch (error) {
        console.error('Failed to fetch teams', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Teams</h2>
      <ul>
        {teams.map((team) => (
          <div key={team.id}>
            <li key={team.id}>{team.name}</li>
            <Link to={`/team/${team.id}`}>View Details</Link>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default TeamList;

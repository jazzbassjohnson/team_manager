import { useEffect, useState } from 'react';
import { getTeam } from '@/api/teams';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

interface Team {
  id: number;
  name: string;
  description: string;
  // add other relevant fields
}

function TeamDetails() {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeam = async () => {
      if (!id) {
        navigate('/teams');
        return;
      }

      setLoading(true);
      try {
        const response = await getTeam(Number(id));
        if (response.data.length > 0) {
          setTeam(response.data[0]);
        } else {
          navigate('/teams');
        }
      } catch (error) {
        console.error('Failed to fetch team', error);
        navigate('/teams');
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [id, navigate]);

  if (loading || !team) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Team Details</h1>
      <div>
        <h2>{team.name}</h2>
        <p>{team.description}</p>
      </div>
    </div>
  );
}

export default TeamDetails;

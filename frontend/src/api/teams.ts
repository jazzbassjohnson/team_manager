import apiClient from '@/api/apiClient.ts';

function getTeams() {
  return apiClient.get('/teams/');
}

function getTeam(id: number) {
  return apiClient.get(`/teams/${id}/`);
}

function createTeam(data: any) {
  return apiClient.post('/teams/', data);
}

function updateTeam(id: number, data: any) {
  return apiClient.put(`/teams/${id}/`, data);
}

export { getTeams, getTeam, createTeam, updateTeam };

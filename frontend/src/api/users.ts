import apiClient from '@/api/apiClient.ts';

function getUsers() {
  return apiClient.get('/users');
}

function getUser(id: number) {
  return apiClient.get(`/users/${id}`);
}

function createUser(data: any) {
  return apiClient.post('/users', data);
}

function updateUser(id: number, data: any) {
  return apiClient.put(`/users/${id}`, data);
}

export { getUsers, getUser, createUser, updateUser };

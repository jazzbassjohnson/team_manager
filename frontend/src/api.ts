import axios from 'axios'
import { ACCESS_TOKEN } from '@/context/constants.ts'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

api.interceptors.request.use(
    (config) => {
        const access_token = localStorage.getItem(ACCESS_TOKEN)
        if (access_token) {
            config.headers['Authorization'] = 'Bearer ' + access_token
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api

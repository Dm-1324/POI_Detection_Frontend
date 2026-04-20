import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://poidetection-backend.onrender.com',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

export default {
  login(credentials) {
    return apiClient.post('/auth/login', credentials)
  },
  register(credentials) {
    return apiClient.post('/auth/register', credentials)
  },
  submitConsent(username) {
    return apiClient.post(`/auth/consent?username=${username}`)
  },
  updateLocation(locationData) {
    return apiClient.post('/location/update', locationData)
  },
}

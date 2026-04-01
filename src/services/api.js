import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
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

<template>
  <div class="dashboard-grid">
    <div class="card status-card">
      <div class="card-header">
        <h4>Background Tracking</h4>
        <div class="indicator" :class="isTracking ? 'indicator-on' : 'indicator-off'"></div>
      </div>
      <p class="status-msg">
        {{
          isTracking
            ? 'The system is monitoring your position every 30 seconds.'
            : 'Tracking is currently suspended.'
        }}
      </p>
      <button
        @click="toggleAutoTracking"
        class="btn"
        :class="isTracking ? 'btn-danger' : 'btn-success'"
      >
        {{ isTracking ? 'Stop Service' : 'Start Service' }}
      </button>
    </div>

    <div class="card test-card">
      <h4>Manual Position Override</h4>
      <p class="hint">Simulate your location to test detection logic.</p>
      <div class="input-row">
        <input
          v-model.number="manualCoords.latitude"
          type="number"
          step="any"
          placeholder="Latitude"
        />
        <input
          v-model.number="manualCoords.longitude"
          type="number"
          step="any"
          placeholder="Longitude"
        />
      </div>
      <button @click="triggerManualUpdate" class="btn btn-secondary">Check Location</button>
    </div>

    <div
      v-if="serverStatus"
      class="card alert-card"
      :class="{
        'welcome-bg': serverStatus.includes('Welcome'),
        'error-bg': serverStatus.includes('not responding') || serverStatus === 'Connection Error',
      }"
    >
      <h4>Server Feedback</h4>
      <div class="alert-content">
        <span class="alert-icon">
          {{ serverStatus.includes('Welcome') ? '🎉' : '⚠️' }}
        </span>
        <p>{{ serverStatus }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onUnmounted } from 'vue'
import api from '../services/api'

const props = defineProps(['user'])
const isTracking = ref(false)
const serverStatus = ref('')
const manualCoords = reactive({ latitude: 28.5355, longitude: 77.391 })
let trackingInterval = null

async function sendLocationUpdate(lat, lon) {
  try {
    const response = await api.updateLocation({
      username: props.user.username,
      latitude: lat,
      longitude: lon,
    })
    serverStatus.value = response.data
    if (response.data.startsWith('Welcome')) {
      showBrowserNotification(response.data)
    }
  } catch (error) {
    serverStatus.value = error.response?.data || 'Connection Error'
    console.log(error)
  }
}

function toggleAutoTracking() {
  if (isTracking.value) {
    stopTracking()
  } else {
    startTracking()
  }
}

function startTracking() {
  isTracking.value = true
  requestNotificationPermission()
  getCurrentLocation()
  trackingInterval = setInterval(() => getCurrentLocation(), 30000)
}

function stopTracking() {
  if (trackingInterval) clearInterval(trackingInterval)
  isTracking.value = false
}

function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(
    (pos) => sendLocationUpdate(pos.coords.latitude, pos.coords.longitude),
    (err) => {
      serverStatus.value = 'GPS Error'
      stopTracking()
      console.log(err)
    },
    { enableHighAccuracy: true },
  )
}

function triggerManualUpdate() {
  requestNotificationPermission()
  sendLocationUpdate(manualCoords.latitude, manualCoords.longitude)
}

function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
}

function showBrowserNotification(message) {
  if (Notification.permission === 'granted') {
    new Notification('POI Detected', { body: message })
  }
}

onUnmounted(() => stopTracking())
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  width: 100%;
}

.alert-card {
  grid-column: 1 / -1;
  border-left: 5px solid #007bff;
}

.card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card h4 {
  margin: 0;
  color: #333;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.indicator-on {
  background: #28a745;
  box-shadow: 0 0 8px #28a745;
}

.indicator-off {
  background: #dc3545;
}

.status-msg {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.hint {
  font-size: 0.8rem;
  color: #999;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

.input-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

@media (max-width: 480px) {
  .input-row {
    flex-direction: column;
  }
}

.input-row input {
  flex: 1;
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.btn {
  border: none;
  padding: 0.8rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: background 0.2s;
}

.btn-success {
  background: #28a745;
  color: white;
}
.btn-danger {
  background: #dc3545;
  color: white;
}
.btn-secondary {
  background: #6c757d;
  color: white;
}

.welcome-bg {
  background: #e7f3ff;
  border-left-color: #28a745;
}

.error-bg {
  background: #fff5f5;
  border-left-color: #dc3545;
  color: #c53030;
}

.alert-content {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 0.5rem;
}

.alert-icon {
  font-size: 1.5rem;
}
</style>

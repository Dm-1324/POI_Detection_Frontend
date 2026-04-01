<template>
  <div class="dashboard">
    <div class="status-panel card">
      <h3>
        Auto-Tracking (30s):
        <span :class="isTracking ? 'on' : 'off'">{{ isTracking ? 'ACTIVE' : 'INACTIVE' }}</span>
      </h3>
      <button @click="toggleAutoTracking" class="btn" :class="isTracking ? 'danger' : 'success'">
        {{ isTracking ? 'Stop Auto-Tracking' : 'Start Auto-Tracking' }}
      </button>
      <p v-if="isTracking" class="hint">Sending location to server every 30 seconds...</p>
    </div>

    <div class="test-panel card">
      <h4>Manual Coordinate Test</h4>
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
      <button @click="triggerManualUpdate" class="btn secondary">Check This Location</button>
    </div>

    <div v-if="serverStatus" class="notification-log card">
      <h4>Server Response</h4>
      <p :class="serverStatus.includes('Welcome') ? 'welcome-text' : 'status-text'">
        {{ serverStatus }}
      </p>
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

    // Trigger notification if backend returns a Welcome message
    if (response.data.startsWith('Welcome')) {
      showBrowserNotification(response.data)
    }
  } catch (error) {
    console.error('API Error:', error)
    serverStatus.value = 'Failed to connect to server.'
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

  // Requirement: Continuously tracks location in background
  // 1. Send immediate update
  getCurrentLocation()

  // 2. Set interval for every 30 seconds
  trackingInterval = setInterval(() => {
    getCurrentLocation()
  }, 30000)
}

function stopTracking() {
  if (trackingInterval) {
    clearInterval(trackingInterval)
    trackingInterval = null
  }
  isTracking.value = false
}

function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(
    (pos) => sendLocationUpdate(pos.coords.latitude, pos.coords.longitude),
    (err) => {
      console.error(err)
      serverStatus.value = 'GPS Error: ' + err.message
      stopTracking()
    },
    { enableHighAccuracy: true },
  )
}

function triggerManualUpdate() {
  sendLocationUpdate(manualCoords.latitude, manualCoords.longitude)
}

function showBrowserNotification(message) {
  if (!('Notification' in window)) return

  if (Notification.permission === 'granted') {
    new Notification('POI Entry Detected', { body: message, icon: '/favicon.ico' })
  } else if (Notification.permission !== 'denied') {
    // Re-request permission if it wasn't explicitly denied
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification('POI Entry Detected', { body: message })
      }
    })
  }
}

// Cleanup interval if component is destroyed
onUnmounted(() => {
  stopTracking()
})
</script>

<style scoped>
.card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.on {
  color: #28a745;
  font-weight: bold;
}
.off {
  color: #dc3545;
  font-weight: bold;
}
.input-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
.input-row input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.btn {
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  transition: 0.3s;
}
.success {
  background: #28a745;
  color: white;
}
.danger {
  background: #dc3545;
  color: white;
}
.secondary {
  background: #6c757d;
  color: white;
}
.welcome-text {
  font-weight: bold;
  color: #007bff;
  border-left: 4px solid #007bff;
  padding-left: 10px;
}
.status-text {
  color: #555;
  font-style: italic;
}
.hint {
  font-size: 0.8rem;
  color: #777;
  margin-top: 5px;
}
</style>

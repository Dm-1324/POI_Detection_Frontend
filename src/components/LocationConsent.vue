<template>
  <div class="consent-container">
    <div class="consent-card">
      <div class="icon-circle">📍</div>
      <h3>Enable Location Access</h3>
      <p>
        To provide real-time alerts for nearby
        <strong>Restaurants, Fuel Stations, and Malls</strong>, we need your explicit permission to
        track your movement.
      </p>
      <div class="feature-list">
        <div class="feature-item">✓ Real-time POI detection</div>
        <div class="feature-item">✓ Background movement tracking</div>
        <div class="feature-item">✓ Instant "Welcome" notifications</div>
      </div>
      <button @click="confirmConsent" class="btn btn-success">I Agree & Continue</button>
      <p class="disclaimer">You can withdraw your consent by logging out at any time.</p>
    </div>
  </div>
</template>

<script setup>
import api from '../services/api'

const props = defineProps(['username'])
const emit = defineEmits(['consent-updated'])

async function confirmConsent() {
  try {
    const response = await api.submitConsent(props.username)
    emit('consent-updated', response.data)
  } catch (error) {
    alert('Failed to save consent.')
    console.log(error)
  }
}
</script>

<style scoped>
.consent-container {
  display: flex;
  justify-content: center;
  padding-top: 2rem;
}
.consent-card {
  background: #f0f7ff;
  padding: 2.5rem;
  border-radius: 20px;
  text-align: center;
  max-width: 450px;
  border: 1px solid #d0e4ff;
}
.icon-circle {
  width: 60px;
  height: 60px;
  background: #007bff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 1.5rem;
  font-size: 1.5rem;
}
.consent-card h3 {
  margin: 0 0 1rem;
  color: #004085;
}
.consent-card p {
  color: #495057;
  line-height: 1.6;
}
.feature-list {
  text-align: left;
  background: white;
  padding: 1rem;
  border-radius: 12px;
  margin: 1.5rem 0;
}
.feature-item {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #28a745;
  font-weight: 500;
}
.btn-success {
  background: #28a745;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 10px;
  width: 100%;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
}
.disclaimer {
  font-size: 0.75rem;
  color: #888;
  margin-top: 1.5rem;
}
</style>

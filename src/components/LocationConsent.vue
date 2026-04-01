<template>
  <div class="consent-card">
    <h3>🌍 Enable Location Tracking</h3>
    <p>
      To provide real-time alerts for nearby restaurants, fuel stations, and malls, we need your
      permission to track your location in the background.
    </p>
    <div class="consent-actions">
      <button @click="confirmConsent" class="btn success">I Consent & Enable Alerts</button>
    </div>
    <p class="privacy-note">Your data privacy is our priority.</p>
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
    alert('Failed to save consent. Please try again.')
  }
}
</script>

<style scoped>
.consent-card {
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  text-align: center;
  border: 2px solid #e0e0e0;
}
.btn.success {
  background: #28a745;
  color: white;
  width: 100%;
  margin-top: 1rem;
}
.privacy-note {
  font-size: 0.8rem;
  color: #666;
  margin-top: 1rem;
}
</style>

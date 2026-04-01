<template>
  <div class="app-shell">
    <header class="navbar">
      <div class="brand">
        <span class="logo">📍</span>
        <h1>POI Detector</h1>
      </div>
      <button v-if="user" @click="logout" class="btn-logout">Logout</button>
    </header>

    <main class="main-content">
      <UserAuth v-if="!user" @auth-success="onUserAuthenticated" />
      <LocationConsent
        v-else-if="!user.consent"
        :username="user.username"
        @consent-updated="onUserAuthenticated"
      />
      <PoiDashboard v-else :user="user" />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UserAuth from './components/UserAuth.vue'
import LocationConsent from './components/LocationConsent.vue'
import PoiDashboard from './components/PoiDashboard.vue'

const user = ref(null)
function onUserAuthenticated(userData) {
  user.value = userData
}
function logout() {
  user.value = null
  location.reload()
}
</script>

<style>
body {
  background-color: #f8f9fa;
  margin: 0;
  font-family:
    'Inter',
    -apple-system,
    sans-serif;
}
.app-shell {
  min-height: 100vh;
}
.navbar {
  background: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.brand h1 {
  font-size: 1.25rem;
  margin: 0;
  color: #333;
}
.logo {
  font-size: 1.5rem;
}
.main-content {
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1rem;
}
.btn-logout {
  background: none;
  border: 1px solid #dc3545;
  color: #dc3545;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}
.btn-logout:hover {
  background: #dc3545;
  color: white;
}
</style>

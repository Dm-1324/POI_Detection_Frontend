<template>
  <div id="app" class="app-container">
    <header class="app-header">
      <h1>POI Detector Pro</h1>
      <button v-if="user" @click="logout" class="logout-link">Logout</button>
    </header>

    <main class="content">
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
  location.reload() // Simple state reset
}
</script>

<style>
body {
  background: #f4f7f9;
  margin: 0;
  color: #333;
}
.app-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.logout-link {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  text-decoration: underline;
}
.content {
  display: flex;
  flex-direction: column;
}
</style>

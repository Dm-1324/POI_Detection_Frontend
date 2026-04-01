<template>
  <div class="auth-card">
    <h2>Access POI Tracker</h2>
    <div class="form-group">
      <input v-model="form.username" placeholder="Username" class="input-field" />
      <input v-model="form.password" type="password" placeholder="Password" class="input-field" />
    </div>
    <div class="button-group">
      <button @click="handleAction('login')" class="btn primary">Login</button>
      <button @click="handleAction('register')" class="btn secondary">Register</button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import api from '../services/api'

const emit = defineEmits(['auth-success'])
const form = reactive({ username: '', password: '' })

async function handleAction(type) {
  try {
    const response = await api[type](form)
    emit('auth-success', response.data)
  } catch (error) {
    alert(error.response?.data?.message || 'Authentication failed. Please check your credentials.')
  }
}
</script>

<style scoped>
.auth-card {
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.input-field {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.primary {
  background: #007bff;
  color: white;
  margin-right: 10px;
}
.secondary {
  background: #6c757d;
  color: white;
}
</style>

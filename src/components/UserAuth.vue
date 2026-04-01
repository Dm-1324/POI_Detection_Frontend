<template>
  <div class="auth-wrapper">
    <div class="auth-container" :class="{ 'show-register': isRegister }">
      <div class="auth-tabs">
        <button @click="isRegister = false" :class="{ active: !isRegister }">Login</button>
        <button @click="isRegister = true" :class="{ active: isRegister }">Register</button>
      </div>

      <div class="forms-slider">
        <div class="form-side login-side">
          <h3>Welcome Back</h3>
          <p>Please enter your credentials</p>

          <div class="input-group">
            <label>Username</label>
            <input
              v-model="loginForm.username"
              type="text"
              placeholder="dhruv_malik"
              :class="{ 'error-border': errors.loginUser }"
            />
            <span v-if="errors.loginUser" class="error-text">{{ errors.loginUser }}</span>
          </div>

          <div class="input-group">
            <label>Password</label>
            <input
              v-model="loginForm.password"
              type="password"
              placeholder="••••••••"
              :class="{ 'error-border': errors.loginPass }"
            />
            <span v-if="errors.loginPass" class="error-text">{{ errors.loginPass }}</span>
          </div>

          <button @click="submitLogin" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Authenticating...' : 'Sign In' }}
          </button>
        </div>

        <div class="form-side register-side">
          <h3>Create Account</h3>
          <p>Join the POI tracking community</p>

          <div class="input-group">
            <label>Choose Username</label>
            <input
              v-model="registerForm.username"
              type="text"
              placeholder="new_user123"
              :class="{ 'error-border': errors.regUser }"
            />
            <span v-if="errors.regUser" class="error-text">{{ errors.regUser }}</span>
          </div>

          <div class="input-group">
            <label>Password</label>
            <input
              v-model="registerForm.password"
              type="password"
              placeholder="••••••••"
              :class="{ 'error-border': errors.regPass }"
            />
            <span v-if="errors.regPass" class="error-text">{{ errors.regPass }}</span>
          </div>

          <button @click="submitRegister" class="btn btn-success" :disabled="loading">
            {{ loading ? 'Creating Account...' : 'Register' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import api from '../services/api'

const emit = defineEmits(['auth-success'])
const isRegister = ref(false)
const loading = ref(false)

const loginForm = reactive({ username: '', password: '' })
const registerForm = reactive({ username: '', password: '' })
const errors = reactive({ loginUser: '', loginPass: '', regUser: '', regPass: '' })

// Clear errors when switching tabs
function clearErrors() {
  Object.keys(errors).forEach((key) => (errors[key] = ''))
}

function validateLogin() {
  clearErrors()
  let valid = true
  if (!loginForm.username) {
    errors.loginUser = 'Username is required'
    valid = false
  }
  if (!loginForm.password) {
    errors.loginPass = 'Password is required'
    valid = false
  }
  return valid
}

function validateRegister() {
  clearErrors()
  let valid = true
  if (!registerForm.username || registerForm.username.length < 3) {
    errors.regUser = 'Username must be at least 3 characters'
    valid = false
  }
  if (!registerForm.password || registerForm.password.length < 6) {
    errors.regPass = 'Password must be at least 6 characters'
    valid = false
  }
  return valid
}

async function submitLogin() {
  if (!validateLogin()) return
  loading.value = true
  try {
    const res = await api.login(loginForm)
    emit('auth-success', res.data)
  } catch (err) {
    alert(err.response?.data?.message || 'Invalid username or password')
  } finally {
    loading.value = false
  }
}

async function submitRegister() {
  if (!validateRegister()) return
  loading.value = true
  try {
    const res = await api.register(registerForm)
    emit('auth-success', res.data) // Auto-login after registration
  } catch (err) {
    alert(err.response?.data?.message || 'Registration failed. Username might be taken.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

.auth-container {
  background: white;
  width: 400px;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  transition: all 0.4s ease;
}

.auth-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
}
.auth-tabs button {
  flex: 1;
  padding: 1.2rem;
  border: none;
  background: #f8f9fa;
  cursor: pointer;
  font-weight: 600;
  color: #888;
  transition: 0.3s;
}
.auth-tabs button.active {
  background: white;
  color: #007bff;
  border-bottom: 2px solid #007bff;
}

.forms-slider {
  display: flex;
  width: 200%; /* Double width for two forms */
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Slide logic */
.show-register .forms-slider {
  transform: translateX(-50%);
}

.form-side {
  width: 50%;
  padding: 2rem;
  box-sizing: border-box;
}

h3 {
  margin: 0 0 0.5rem;
  color: #333;
}
p {
  color: #777;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.input-group {
  margin-bottom: 1.2rem;
  text-align: left;
}
.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.85rem;
}
.input-group input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-sizing: border-box;
  transition: 0.3s;
}
.input-group input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}
.error-border {
  border-color: #dc3545 !important;
}
.error-text {
  color: #dc3545;
  font-size: 0.75rem;
  margin-top: 0.3rem;
  display: block;
}

.btn {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 1rem;
}
.btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.btn-primary {
  background: #007bff;
  color: white;
}
.btn-success {
  background: #28a745;
  color: white;
}
</style>

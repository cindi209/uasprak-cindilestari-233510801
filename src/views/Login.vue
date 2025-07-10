<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="handleLogin">
      <h1>Login</h1>

      <label>Username</label>
      <input v-model="username" type="text" placeholder="Masukkan username" required />

      <label>Password</label>
      <input v-model="password" type="password" placeholder="Masukkan password" required />

      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../axios'
import { useUserStore } from '../stores/user'

const router = useRouter()
const username = ref('')
const password = ref('')
const userStore = useUserStore()

async function handleLogin() {
  try {
    const res = await api.get('/users', {
      params: { username: username.value, password: password.value }
    })

    if (res.data.length > 0) {
      const user = res.data[0]
      userStore.setUser(user) // simpan ke Pinia store
      router.push('/dashboard')
    } else {
      alert('Username atau password salah!')
    }
  } catch (err) {
    console.error(err)
    alert('Terjadi kesalahan saat login.')
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, #a18cd1, #fbc2eb);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.login-form {
  background: #ffffff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.8s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-form h1 {
  margin-bottom: 28px;
  font-size: 26px;
  font-weight: 700;
  color: #444;
  text-align: center;
  letter-spacing: 0.5px;
}

.login-form label {
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
  font-size: 14px;
}

.login-form input {
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 14px;
  transition: 0.3s;
}

.login-form input:focus {
  border-color: #8e2de2;
  box-shadow: 0 0 0 3px rgba(142, 45, 226, 0.2);
  outline: none;
}

.login-form button {
  padding: 12px;
  background: linear-gradient(to right, #8e2de2, #4a00e0);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  transition: 0.3s;
}

.login-form button:hover {
  background: linear-gradient(to right, #7a1dcf, #3a00c3);
  transform: scale(1.02);
}
</style>

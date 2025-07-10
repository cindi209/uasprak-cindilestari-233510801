<template>
  <div class="app-container">
    <header>
      <h2 class="app-title">Aplikasi Kasir Toko Sederhana</h2>
      <nav v-if="!isLoginPage" class="main-nav">
        <router-link to="/dashboard">Dashboard</router-link>
        <router-link to="/barang">Barang</router-link>
        <router-link to="/barang/form">Tambah Barang</router-link>
        <router-link to="/transaksi">Transaksi</router-link>
        <router-link to="/barang-masuk">Barang Masuk</router-link>
        <router-link to="/barang-keluar">Barang Keluar</router-link>
        <router-link to="/laporan-penjualan">Laporan Penjualan</router-link>
        <router-link to="/laporan-stok">Laporan Stok</router-link>
        <button class="logout-button" @click="logout">Logout</button>
      </nav>
    </header>
    <hr class="divider" />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

const isLoginPage = computed(() => route.path === '/login')

function logout() {
  // Hapus session user (jika ada)
  localStorage.removeItem('user')
  router.push('/login')
}
</script>

<style scoped>
.app-container {
  font-family: 'Segoe UI', sans-serif;
  background-color: #f5f5fa;
  min-height: 100vh;
  padding: 20px;
}

.app-title {
  color: #5e3ea1;
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.main-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
  background-color: #ece9f8;
  padding: 10px 15px;
  border-radius: 6px;
}

.main-nav a {
  text-decoration: none;
  color: #5e3ea1;
  font-weight: 500;
  padding: 6px 10px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.main-nav a:hover {
  background-color: #ddd6f3;
}

.logout-button {
  margin-left: auto;
  background-color: transparent;
  border: none;
  color: #e63946;
  font-weight: bold;
  cursor: pointer;
  padding: 6px 10px;
}

.logout-button:hover {
  background-color: #fce4e4;
  border-radius: 4px;
}

.divider {
  border: none;
  border-top: 1px solid #ccc;
  margin: 15px 0;
}

main {
  padding-top: 10px;
}
</style>

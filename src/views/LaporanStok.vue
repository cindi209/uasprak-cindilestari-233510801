<template>
  <div class="stok-container">
    <h1>Laporan Stok Barang</h1>
    <hr />
    <table class="stok-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nama Barang</th>
          <th>Stok</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="b in stokBarang" :key="b.id">
          <td>{{ b.id }}</td>
          <td>{{ b.nama }}</td>
          <td>{{ b.stok }}</td>
        </tr>
        <tr v-if="stokBarang.length === 0">
          <td colspan="3">Data stok belum tersedia.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../axios'

const stokBarang = ref([])

onMounted(() => {
  ambilStok()
})

async function ambilStok() {
  try {
    const res = await api.get('/barang')
    stokBarang.value = res.data
  } catch (err) {
    alert('Gagal mengambil data stok barang.')
    console.error(err)
  }
}
</script>

<style scoped>
.stok-container {
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f9f9fd;
  min-height: 100vh;
}

h1 {
  color: #4b2d88;
  font-size: 1.8rem;
  margin-bottom: 1rem;
  text-align: center;
}

hr {
  margin-bottom: 1.5rem;
}

.stok-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stok-table th,
.stok-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

.stok-table th {
  background-color: #5e3ea1;
  color: white;
}

.stok-table tr:hover {
  background-color: #f2f2f8;
}
</style>

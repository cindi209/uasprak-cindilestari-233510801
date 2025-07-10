<template>
  <div class="dashboard-container">
    <h1 class="dashboard-title">Dashboard</h1>
    <hr class="separator" />

    <!-- Ringkasan Hari Ini -->
    <section class="summary">
      <h2 class="section-title">Ringkasan Hari Ini</h2>
      <div class="summary-cards">
        <div class="card">
          <p class="card-label">Total Transaksi</p>
          <p class="card-value">{{ totalTransaksi }}</p>
        </div>
        <div class="card">
          <p class="card-label">Total Barang Terjual</p>
          <p class="card-value">{{ totalBarangTerjual }}</p>
        </div>
        <div class="card">
          <p class="card-label">Total Pendapatan</p>
          <p class="card-value">Rp {{ formatRupiah(totalPendapatan) }}</p>
        </div>
      </div>
    </section>

    <!-- Info Stok Barang -->
    <section class="stock-info">
      <h2 class="section-title">Info Stok Barang</h2>
      <div class="table-container">
        <table class="stock-table">
          <thead>
            <tr>
              <th>Nama Barang</th>
              <th>Stok</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="barang in stokBarang" :key="barang.id">
              <td>{{ barang.nama }}</td>
              <td>{{ barang.stok }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../axios'

const totalTransaksi = ref(0)
const totalBarangTerjual = ref(0)
const totalPendapatan = ref(0)
const stokBarang = ref([])

function formatRupiah(angka) {
  return angka.toLocaleString('id-ID')
}

onMounted(async () => {
  await fetchStokBarang()
  await fetchRingkasan()
})

async function fetchStokBarang() {
  try {
    const res = await api.get('/barang')
    stokBarang.value = res.data
  } catch (err) {
    alert('Gagal memuat data stok barang.')
    console.error(err)
  }
}

async function fetchRingkasan() {
  try {
    const transaksiRes = await api.get('/transaksi')
    const penjualan = transaksiRes.data

    totalTransaksi.value = penjualan.length
    totalBarangTerjual.value = penjualan.reduce((sum, p) => sum + (p.jumlah || 0), 0)
    totalPendapatan.value = penjualan.reduce((sum, p) => sum + (p.total || 0), 0)
  } catch (err) {
    alert('Gagal memuat data penjualan.')
    console.error(err)
  }
}
</script>

<style scoped>
.dashboard-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f8f8ff;
  font-family: 'Segoe UI', sans-serif;
}

.dashboard-title {
  color: #5e3ea1;
  font-size: 2.2rem;
  margin-bottom: 15px;
}

.separator {
  margin-bottom: 25px;
  border: 1px solid #ccc;
}

.section-title {
  color: #444;
  margin-bottom: 15px;
  font-size: 1.4rem;
}

.summary-cards {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-left: 5px solid #5e3ea1;
  border-radius: 5px;
  padding: 20px;
  flex: 1 1 250px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.card-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #5e3ea1;
}

.table-container {
  overflow-x: auto;
}

.stock-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border: 1px solid #ccc;
}

.stock-table th, .stock-table td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #ddd;
}

.stock-table th {
  background-color: #5e3ea1;
  color: white;
  font-weight: normal;
}

.stock-table tr:hover {
  background-color: #f0f0fa;
}
</style>

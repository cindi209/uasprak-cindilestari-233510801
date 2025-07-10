<template>
  <div class="laporan-container">
    <h1>Laporan Penjualan</h1>
    <hr />

    <table class="laporan-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Barang</th>
          <th>Jumlah</th>
          <th>Total Harga</th>
          <th>Tanggal</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="laporan.length === 0">
          <td colspan="6">Belum ada transaksi penjualan.</td>
        </tr>
        <tr v-for="t in laporan" :key="t.id">
          <td>{{ t.id }}</td>
          <td>{{ t.namaBarang }}</td>
          <td>{{ t.jumlah }}</td>
          <td>Rp {{ formatRupiah(t.total) }}</td>
          <td>{{ formatTanggal(t.tanggal) }}</td>
          <td>
            <button class="btn-delete" @click="hapusTransaksi(t.id)">Hapus</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../axios'

const laporan = ref([])

onMounted(ambilData)

async function ambilData() {
  try {
    const res = await api.get('/transaksi') // sesuai endpoint json-server
    laporan.value = res.data
  } catch (err) {
    alert('Gagal mengambil data laporan penjualan.')
    console.error(err)
  }
}

async function hapusTransaksi(id) {
  if (confirm('Yakin ingin menghapus transaksi ini?')) {
    try {
      await api.delete(`/transaksi/${id}`)
      laporan.value = laporan.value.filter(t => t.id !== id)
    } catch (err) {
      alert('Gagal menghapus transaksi.')
      console.error(err)
    }
  }
}

function formatRupiah(angka) {
  return angka?.toLocaleString('id-ID') || '0'
}

function formatTanggal(tgl) {
  const d = new Date(tgl)
  return isNaN(d.getTime())
    ? 'Tanggal tidak valid'
    : d.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
}
</script>

<style scoped>
.laporan-container {
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f4f4fc;
  min-height: 100vh;
}

h1 {
  color: #5e3ea1;
  font-size: 1.8rem;
  margin-bottom: 1rem;
  text-align: center;
}

hr {
  margin-bottom: 1.5rem;
}

.laporan-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.laporan-table th,
.laporan-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

.laporan-table th {
  background-color: #5e3ea1;
  color: white;
  font-weight: normal;
}

.btn-delete {
  background-color: #e74c3c;
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-delete:hover {
  background-color: #c0392b;
}
</style>

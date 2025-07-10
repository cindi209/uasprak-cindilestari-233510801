<template>
  <div class="barang-container">
    <h1>Daftar Barang</h1>
    <hr />
    <button class="btn-primary" @click="tambahBarang">+ Tambah Barang</button>

    <table class="barang-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nama</th>
          <th>Stok</th>
          <th>Harga</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isLoading">
          <td colspan="5">Memuat data barang...</td>
        </tr>
        <tr v-else-if="daftarBarang.length === 0">
          <td colspan="5">Belum ada data barang.</td>
        </tr>
        <tr v-for="barang in daftarBarang" :key="barang.id">
          <td>{{ barang.id }}</td>
          <td>{{ barang.nama }}</td>
          <td>{{ barang.stok }}</td>
          <td>Rp {{ formatRupiah(barang.harga) }}</td>
          <td>
            <button class="btn-edit" @click="editBarang(barang.id)">Edit</button>
            <button class="btn-delete" @click="hapusBarang(barang.id)">Hapus</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../axios'

const router = useRouter()
const daftarBarang = ref([])
const isLoading = ref(true)

function formatRupiah(angka) {
  return angka.toLocaleString('id-ID')
}

function tambahBarang() {
  router.push('/barang/form')
}

function editBarang(id) {
  router.push({ path: '/barang/form', query: { id } })
}

async function hapusBarang(id) {
  const konfirmasi = confirm('Yakin ingin menghapus barang ini?')
  if (!konfirmasi) return

  try {
    await api.delete(`/barang/${id}`)
    daftarBarang.value = daftarBarang.value.filter(barang => barang.id !== id)
    alert('Barang berhasil dihapus.')
  } catch (err) {
    alert('Gagal menghapus barang.')
    console.error(err)
  }
}

async function fetchBarang() {
  try {
    isLoading.value = true
    const res = await api.get('/barang')
    daftarBarang.value = res.data
  } catch (err) {
    alert('Gagal memuat data barang.')
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchBarang()
})
</script>

<style scoped>
.barang-container {
  font-family: 'Segoe UI', sans-serif;
  padding: 20px;
  background-color: #f9f9fd;
  min-height: 100vh;
}

h1 {
  color: #4b2d88;
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-align: center;
}

hr {
  margin-bottom: 20px;
}

.btn-primary {
  background-color: #5e3ea1;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 15px;
}

.btn-primary:hover {
  background-color: #4b2d88;
}

.barang-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.barang-table th,
.barang-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

.barang-table th {
  background-color: #ece9f8;
  color: #333;
}

.btn-edit,
.btn-delete {
  padding: 6px 10px;
  margin-right: 5px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-weight: bold;
}

.btn-edit {
  background-color: #3498db;
  color: white;
}

.btn-edit:hover {
  background-color: #2980b9;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
}

.btn-delete:hover {
  background-color: #c0392b;
}
</style>

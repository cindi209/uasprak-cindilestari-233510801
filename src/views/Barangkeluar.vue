<template>
  <div class="form-container">
    <h1>Barang Keluar</h1>
    <hr />

    <form @submit.prevent="simpanBarangKeluar" class="form-box">
      <div class="form-group">
        <label for="barang">Pilih Barang:</label>
        <select id="barang" v-model="form.barangId" required>
          <option disabled value="">-- Pilih Barang --</option>
          <option v-for="barang in daftarBarang" :key="barang.id" :value="barang.id">
            {{ barang.nama }}
          </option>
        </select>
      </div>
      

      <div class="form-group">
        <label for="jumlah">Jumlah Keluar:</label>
        <input type="number" v-model.number="form.jumlah" id="jumlah" min="1" required />
      </div>

      <div class="form-group">
        <label for="keterangan">Keterangan:</label>
        <textarea v-model="form.keterangan" id="keterangan" placeholder="Contoh: rusak / kadaluarsa"></textarea>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary">Simpan</button>
        <button type="button" class="btn-cancel" @click="resetForm">Reset</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../axios'

const router = useRouter()

const daftarBarang = ref([])
const form = ref({
  barangId: '',
  jumlah: 1,
  keterangan: ''
})

onMounted(async () => {
  try {
    const response = await api.get('/barang')
    daftarBarang.value = response.data
  } catch (error) {
    alert('Gagal memuat daftar barang.')
    console.error(error)
  }
})

async function simpanBarangKeluar() {
  const barang = daftarBarang.value.find(b => b.id === form.value.barangId)
  if (!barang) return alert('Barang tidak ditemukan.')

  if (form.value.jumlah > barang.stok) {
    return alert('Jumlah melebihi stok yang tersedia.')
  }

  const dataKeluar = {
    barangId: barang.id,
    namaBarang: barang.nama,
    jumlah: form.value.jumlah,
    keterangan: form.value.keterangan,
    tanggal: new Date().toISOString()
  }

  try {
    await api.post('/barangKeluar', dataKeluar)

    // Kurangi stok barang
    await api.patch(`/barang/${barang.id}`, {
      stok: barang.stok - form.value.jumlah
    })

    alert('Barang keluar berhasil disimpan!')
    resetForm()
    router.push('/dashboard')
  } catch (error) {
    alert('Gagal menyimpan data barang keluar.')
    console.error(error)
  }
}

function resetForm() {
  form.value = {
    barangId: '',
    jumlah: 1,
    keterangan: ''
  }
}
</script>


<style scoped>
.form-container {
  font-family: 'Segoe UI', sans-serif;
  padding: 2rem;
  background-color: #f4f2fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  color: #4b2d88;
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-align: center;
}

hr {
  width: 100%;
  max-width: 500px;
  border: none;
  border-top: 2px solid #e0e0e0;
  margin: 1rem 0 2rem;
}

.form-box {
  background: #fff;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.form-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-start;
  gap: 0.75rem;
}

.btn-primary {
  background-color: #7e57c2;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #5e3ea1;
}

.btn-cancel {
  background-color: #e0e0e0;
  color: #333;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
}

.btn-cancel:hover {
  background-color: #c2c2c2;
}
</style>

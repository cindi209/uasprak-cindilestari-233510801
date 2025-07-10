<template>
  <div class="form-container">
    <h1>{{ isEdit ? 'Edit Barang' : 'Tambah Barang' }}</h1>
    <hr />
    <form @submit.prevent="simpanBarang" class="form-box">
      <div class="form-group">
        <label>Nama Barang:</label>
        <input v-model="form.nama" required />
      </div>

      <div class="form-group">
        <label>Stok:</label>
        <input type="number" v-model.number="form.stok" required min="0" />
      </div>

      <div class="form-group">
        <label>Harga:</label>
        <input type="number" v-model.number="form.harga" required min="0" />
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary">Simpan</button>
        <button type="button" class="btn-cancel" @click="batal">Batal</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../axios'

const router = useRouter()
const route = useRoute()

const isEdit = ref(false)
const form = ref({
  nama: '',
  stok: 0,
  harga: 0,
})

const id = route.query.id // ID barang jika dalam mode edit

onMounted(async () => {
  if (id) {
    isEdit.value = true
    try {
      const response = await api.get(`/barang/${id}`)
      form.value = response.data
    } catch (err) {
      alert('Barang tidak ditemukan.')
      router.push('/barang')
    }
  }
})

async function simpanBarang() {
  try {
    if (isEdit.value) {
      await api.put(`/barang/${id}`, form.value)
      alert('Barang berhasil diperbarui.')
    } else {
      await api.post('/barang', form.value)
      alert('Barang berhasil ditambahkan.')
    }
    router.push('/barang')
  } catch (err) {
    alert('Gagal menyimpan barang.')
    console.error(err)
  }
}

function batal() {
  router.push('/barang')
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
  transition: box-shadow 0.3s ease;
}

.form-box:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
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

.form-group input {
  width: 100%;
  padding: 0.75rem 0.50rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #7e57c2;
  box-shadow: 0 0 0 2px rgba(126, 87, 194, 0.2);
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
  transition: background-color 0.2s ease;
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
  transition: background-color 0.2s ease;
}

.btn-cancel:hover {
  background-color: #c2c2c2;
}
</style>

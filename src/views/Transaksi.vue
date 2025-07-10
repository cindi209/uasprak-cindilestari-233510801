<template>
  <div class="transaksi-container">
    <h1>Transaksi Penjualan</h1>
    <hr />

    <form @submit.prevent="simpanTransaksi" class="transaksi-form">
      <div>
        <label>Pilih Barang:</label><br />
        <select v-model="form.barangId" required>
          <option disabled value="">-- Pilih Barang --</option>
          <option v-for="barang in daftarBarang" :key="barang.id" :value="barang.id">
            {{ barang.nama }} {{ formatRupiah(barang.harga) }}
          </option>
        </select>
      </div>

      <div>
        <label>Jumlah:</label><br />
        <input type="number" v-model.number="form.jumlah" required min="1" />
      </div>

      <div>
        <label>Total:</label><br />
        <strong>{{ formatRupiah(totalHarga) }}</strong>
      </div>

      <br />
      <button type="submit">Simpan Transaksi</button>
      <button type="button" @click="resetForm">Reset</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../axios'

const router = useRouter()
const daftarBarang = ref([])
const form = ref({
  barangId: '',
  jumlah: 1
})

onMounted(async () => {
  try {
    const res = await api.get('/barang')
    daftarBarang.value = res.data
  } catch (error) {
    alert('Gagal memuat data barang!')
    console.error(error)
  }
})

const selectedBarang = computed(() =>
  daftarBarang.value.find(b => b.id === form.value.barangId)
)

const totalHarga = computed(() =>
  selectedBarang.value ? selectedBarang.value.harga * form.value.jumlah : 0
)

async function simpanTransaksi() {
  const barang = selectedBarang.value
  if (!barang) {
    alert('Barang belum dipilih.')
    return
  }

  if (form.value.jumlah > barang.stok) {
    alert('Jumlah melebihi stok yang tersedia.')
    return
  }

  const transaksiBaru = {
    barangId: barang.id,
    namaBarang: barang.nama,
    jumlah: form.value.jumlah,
    total: totalHarga.value,
    tanggal: new Date().toISOString()
  }

  try {
    await api.post('/transaksi', transaksiBaru)

    // Kurangi stok barang
    await api.patch(`/barang/${barang.id}`, {
      stok: barang.stok - form.value.jumlah
    })

    alert(`Transaksi berhasil disimpan!`)
    resetForm()
    router.push('/laporan-penjualan')
  } catch (error) {
    alert('Gagal menyimpan transaksi.')
    console.error(error)
  }
}

function resetForm() {
  form.value = {
    barangId: '',
    jumlah: 1
  }
}

function formatRupiah(angka) {
  return angka.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR'
  })
}
</script>

<style scoped>
.transaksi-container {
  max-width: 600px;
  margin: auto;
  padding: 2rem;
  background-color: #f9f9fd;
  font-family: 'Segoe UI', sans-serif;
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

.transaksi-form {
  background: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.transaksi-form div {
  margin-bottom: 1rem;
}

.transaksi-form label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
  color: #333;
}

.transaksi-form select,
.transaksi-form input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.transaksi-form button {
  margin-top: 1rem;
  padding: 10px 16px;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s ease;
}

.transaksi-form button[type='submit'] {
  background-color: #5e3ea1;
  color: white;
  margin-right: 10px;
}

.transaksi-form button[type='submit']:hover {
  background-color: #4b2d88;
}

.transaksi-form button[type='button'] {
  background-color: #e0e0e0;
  color: #333;
}

.transaksi-form button[type='button']:hover {
  background-color: #c2c2c2;
}
</style>

import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import BarangList from '../views/BarangList.vue'
import BarangForm from '../views/BarangForm.vue'
import Transaksi from '../views/Transaksi.vue'
import BarangMasuk from '../views/BarangMasuk.vue'
import BarangKeluar from '../views/BarangKeluar.vue'
import LaporanPenjualan from '../views/LaporanPenjualan.vue'
import LaporanStok from '../views/LaporanStok.vue'

const routes = [
  { path: '/', redirect: '/login' }, 
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard },
  { path: '/barang', component: BarangList },
  { path: '/barang/form', component: BarangForm },
  { path: '/transaksi', component: Transaksi },
  { path: '/barang-masuk', component: BarangMasuk },
  { path: '/barang-keluar', component: BarangKeluar },
  { path: '/laporan-penjualan', component: LaporanPenjualan },
  { path: '/laporan-stok', component: LaporanStok },
  { path: '/laporan', redirect: '/laporan-penjualan' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

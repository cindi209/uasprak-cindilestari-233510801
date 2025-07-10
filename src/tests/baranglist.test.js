import { mount, flushPromises } from '@vue/test-utils'
import BarangList from '../views/Baranglist.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import api from '../axios'

// Mock router
const router = createRouter({
  history: createWebHistory(),
  routes: []
})

// Mock API
vi.mock('../axios', () => ({
  default: {
    get: vi.fn(),
    delete: vi.fn()
  }
}))

describe('BarangList.vue', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('menampilkan daftar barang dari API', async () => {
    api.get.mockResolvedValueOnce({
      data: [
        { id: 1, nama: 'Indomie', stok: 10, harga: 3000 },
        { id: 2, nama: 'Sabun', stok: 5, harga: 5000 }
      ]
    })

    const wrapper = mount(BarangList, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Indomie')
    expect(wrapper.text()).toContain('Sabun')
    expect(api.get).toHaveBeenCalledWith('/barang')
  })

  it('menampilkan pesan jika data kosong', async () => {
    api.get.mockResolvedValueOnce({ data: [] })

    const wrapper = mount(BarangList, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Belum ada data barang.')
  })

  it('navigasi ke form saat tambah barang', async () => {
    api.get.mockResolvedValueOnce({ data: [] })
    const push = vi.spyOn(router, 'push')

    const wrapper = mount(BarangList, {
      global: { plugins: [router] }
    })

    await flushPromises()

    await wrapper.find('button.btn-primary').trigger('click')
    expect(push).toHaveBeenCalledWith('/barang/form')
  })

  it('navigasi ke form edit saat klik edit', async () => {
    api.get.mockResolvedValueOnce({
      data: [{ id: 1, nama: 'Indomie', stok: 10, harga: 3000 }]
    })

    const push = vi.spyOn(router, 'push')

    const wrapper = mount(BarangList, {
      global: { plugins: [router] }
    })

    await flushPromises()

    await wrapper.find('button.btn-edit').trigger('click')

    expect(push).toHaveBeenCalledWith({ path: '/barang/form', query: { id: 1 } })
  })

  it('menghapus barang saat tombol hapus diklik', async () => {
    global.confirm = vi.fn(() => true) // Konfirmasi selalu true
    api.get.mockResolvedValueOnce({
      data: [{ id: 1, nama: 'Indomie', stok: 10, harga: 3000 }]
    })
    api.delete.mockResolvedValueOnce({})

    const wrapper = mount(BarangList, {
      global: { plugins: [router] }
    })

    await flushPromises()
    await wrapper.find('button.btn-delete').trigger('click')

    expect(api.delete).toHaveBeenCalledWith('/barang/1')
  })
})

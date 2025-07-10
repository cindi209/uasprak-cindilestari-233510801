import { defineStore } from 'pinia';
import api from '../axios';

export const useBarangStore = defineStore('barang', {
  state: () => ({
    daftarBarang: [],
    isLoading: false,
    error: null,
  }),
  actions: {
    async fetchBarang() {
      this.isLoading = true;
      try {
        const response = await api.get('/barang');
        this.daftarBarang = response.data;
      } catch (err) {
        this.error = err;
      } finally {
        this.isLoading = false;
      }
    },
    async tambahBarang(barangBaru) {
      try {
        await api.post('/barang', barangBaru);
        await this.fetchBarang();
      } catch (err) {
        this.error = err;
      }
    },
    async hapusBarang(id) {
      try {
        await api.delete(`/barang/${id}`);
        await this.fetchBarang();
      } catch (err) {
        this.error = err;
      }
    },
    async editBarang(id, dataBaru) {
      try {
        await api.put(`/barang/${id}`, dataBaru);
        await this.fetchBarang();
      } catch (err) {
        this.error = err;
      }
    }
  },
});

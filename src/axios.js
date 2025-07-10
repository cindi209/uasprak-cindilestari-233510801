// src/axios.js
import axios from 'axios'

export default axios.create({
  baseURL: 'http://localhost:3000', // ganti jika pakai port atau URL lain
  headers: {
    'Content-Type': 'application/json'
  }
})

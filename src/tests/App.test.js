import { flushPromises } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import App from '../App.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'

// Dummy komponen & routes
const Home = { template: '<div>Dashboard Page</div>' }
const Login = { template: '<div>Login Page</div>' }

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login }
]

let router

beforeEach(() => {
  // Reset router dan localStorage sebelum tiap test
  router = createRouter({
    history: createMemoryHistory(),
    routes
  })

  localStorage.clear()
  global.alert = vi.fn()
})

describe('App.vue', () => {
  it('tidak menampilkan navigasi jika di halaman login', async () => {
    router.push('/login')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('.main-nav').exists()).toBe(false)
  })

  it('menampilkan navigasi jika bukan di halaman login', async () => {
    localStorage.setItem('user', 'admin')
    router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick() // tambahkan ini untuk memastikan update DOM

    expect(wrapper.find('.main-nav').exists()).toBe(true)
    expect(wrapper.text()).toContain('Dashboard')
    expect(wrapper.text()).toContain('Logout')
  })

    it('fungsi logout menghapus localStorage dan redirect ke login', async () => {
    localStorage.setItem('user', 'admin')
    router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()

    const button = wrapper.find('button.logout-button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')
    await flushPromises() // ⬅️ Tambahkan ini untuk tunggu navigasi selesai

    expect(localStorage.getItem('user')).toBeNull()
    expect(router.currentRoute.value.fullPath).toBe('/login')
  })

})

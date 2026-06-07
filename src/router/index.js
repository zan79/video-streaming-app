import { createRouter, createWebHistory } from 'vue-router'
import SeriesPage from '../pages/SeriesPage.vue'
import MoviesPage from '../pages/MoviesPage.vue'
import WatchView from '../pages/WatchView.vue'

const routes = [
  { path: '/', redirect: '/series' },
  { path: '/movies', name: 'movies', component: MoviesPage },
  { path: '/series/:id?', name: 'series', component: SeriesPage, props: true },
  { path: '/watch/:id', name: 'watch', component: WatchView, props: true },
  { path: '/:pathMatch(.*)*', redirect: '/series' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

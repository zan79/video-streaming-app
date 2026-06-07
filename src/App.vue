<template>
  <div class="app-shell">
    <header class="nav-bar">
      <div class="nav-left">
        <div class="logo">FUNFLIX</div>
        <nav class="nav-links">
          <router-link
            v-for="item in menuItems"
            :key="item.id"
            :to="{ name: item.id }"
            class="nav-link"
            :class="{ active: activeRoute === item.id }"
          >
            {{ item.label }}
          </router-link>
        </nav>
      </div>

      <div class="nav-right">
        <!-- <button class="icon-btn">🔍</button>
        <button class="icon-btn">Kids</button>
        <div class="profile">AK</div> -->
      </div>
    </header>

    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const menuItems = [
  { id: 'movies', label: 'Movies' },
  { id: 'series', label: 'Series' }
]

const activeRoute = computed(() => route.name)
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: #141414;
  color: #fff;
  overflow-x: hidden;
}
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 36px;
  background: rgba(0, 0, 0, 0.9);
  position: sticky;
  top: 0;
  z-index: 30;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.nav-left {
  display: flex;
  align-items: center;
  gap: 24px;
}
.logo {
  font-size: 1.7rem;
  font-weight: 800;
  color: #e50914;
  letter-spacing: 0.15em;
}
.nav-links {
  display: flex;
  gap: 18px;
}
.nav-link {
  color: #fff;
  opacity: 0.85;
  font-size: 0.95rem;
  text-decoration: none;
}
.nav-link.active,
.nav-link:hover {
  opacity: 1;
}
.nav-right {
  display: flex;
  align-items: center;
  gap: 14px;
}
.icon-btn {
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border-radius: 999px;
  padding: 10px 14px;
  cursor: pointer;
}
.profile {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background: #333;
  display: grid;
  place-items: center;
  font-weight: 700;
}
@media (max-width: 980px) {
  .nav-bar {
    padding: 16px 24px;
    flex-wrap: wrap;
  }
}
</style>

<template>
  <div class="movie-page">
    <section class="movie-hero">
      <div class="hero-carousel">
        <div
          v-for="(movie, index) in movieVideos"
          :key="movie.id"
          class="hero-slide"
          :style="heroSlideStyle(movie, index)"
        ></div>
      </div>
      <div class="movie-hero-content">
        <h1>All Movies</h1>
        <p>Browse the full movie collection. Select any title to start watching.</p>
        <div class="hero-slides">
          <button
            v-for="(movie, index) in movieVideos"
            :key="movie.id"
            :class="['hero-dot', { active: index === activeIndex }]"
            @click="setSlide(index)"
            aria-label="Select slide"
          />
        </div>
      </div>
    </section>

    <section class="movie-grid">
      <router-link
        class="card"
        v-for="video in movieVideos"
        :key="video.id"
        :to="{ name: 'watch', params: { id: video.id } }"
      >
        <div class="card-thumb" :style="{ backgroundImage: `url(${video.thumbnail})` }"></div>
        <div class="card-meta">
          <p>{{ video.title }}</p>
        </div>
      </router-link>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { videos } from '../data/videos'

const movieVideos = computed(() => videos.filter(video => video.category === 'Movies'))
const activeIndex = ref(0)
let slideTimer = null

function heroSlideStyle(movie, index) {
  return {
    backgroundImage: `linear-gradient(to top, rgba(20,20,20,1) 12%, rgba(20,20,20,0.2) 45%, rgba(20,20,20,0)), url(${movie.banner || ''})`,
    transform: `translateX(${(index - activeIndex.value) * 100}%)`
  }
}

function nextSlide() {
  activeIndex.value = (activeIndex.value + 1) % movieVideos.value.length
}

function setSlide(index) {
  activeIndex.value = index
}

onMounted(() => {
  slideTimer = setInterval(nextSlide, 4500)
})

onBeforeUnmount(() => {
  clearInterval(slideTimer)
})
</script>

<style scoped>
.movie-page {
  background: #141414;
  color: #fff;
}
.movie-hero {
  position: relative;
  min-height: 50vh;
  display: flex;
  align-items: flex-end;
  padding: 48px;
  overflow: hidden;
  background: #111;
}
.hero-carousel {
  position: absolute;
  inset: 0;
  display: block;
  overflow: hidden;
}
.hero-slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transition: transform 0.8s ease;
  will-change: transform;
}
.movie-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(20, 20, 20, 1) 20%, rgba(20, 20, 20, 0.4) 55%, rgba(20, 20, 20, 0) 100%);
}
.movie-hero-content {
  position: relative;
  max-width: 640px;
  z-index: 1;
}
.movie-category {
  display: inline-block;
  color: #e50914;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  margin-bottom: 10px;
  font-weight: 700;
  font-size: 0.85rem;
}
.movie-hero-content h1 {
  margin: 0;
  font-size: clamp(2.4rem, 4vw, 4.8rem);
}
.movie-hero-content p {
  margin-top: 18px;
  max-width: 520px;
  color: #e5e5e5;
  line-height: 1.6;
}
.hero-slides {
  display: flex;
  gap: 10px;
  margin-top: 24px;
}
.hero-dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.15);
  cursor: pointer;
}
.hero-dot.active {
  background: #e50914;
  border-color: #e50914;
}
.movie-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(220px, 1fr));
  gap: 18px;
  padding: 32px 48px 48px;
  margin-top: -40px;
  position: relative;
  z-index: 1;
}
.card {
  width: 100%;
  background: #111;
  border-radius: 18px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}
.card-thumb {
  width: 100%;
  aspect-ratio: 16 / 9;
  background-size: cover;
  background-position: center;
}
.card-meta {
  padding: 14px;
}
.card-meta p {
  margin: 0 0 8px;
  font-weight: 700;
}
.card-meta small {
  color: #b3b3b3;
}
@media (max-width: 980px) {
  .movie-hero {
    padding: 36px 24px;
  }
  .movie-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
    padding: 28px 24px 36px;
  }
}
@media (max-width: 700px) {
  .movie-hero {
    min-height: 42vh;
    padding: 24px 18px;
  }
  .movie-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }
}
</style>

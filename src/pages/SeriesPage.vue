<template>
  <div class="series-page">
    <section class="series-hero" :style="heroStyle">
      <div class="hero-carousel">
        <div
          v-for="(show, index) in heroSlides"
          :key="show.id"
          class="hero-slide"
          :style="heroSlideStyle(show, index)"
        ></div>
      </div>

      <div class="series-hero-content">
        <h1>All Series</h1>
        <p>Browse the complete series collection. Select a show to start watching the first episode.</p>``
        <div class="hero-slides">
          <button
            v-for="(show, index) in heroSlides"
            :key="show.id"
            :class="['hero-dot', { active: index === activeIndex }]"
            @click="setSlide(index)"
            aria-label="Select slide"
          ></button>
        </div>
      </div>
    </section>

    <section class="series-grid">
      <router-link
        class="card"
        v-for="show in showVideos"
        :key="show.id"
        :to="{ name: 'watch', params: { id: show.episodes?.[0]?.id || show.id } }"
      >
        <div class="card-thumb" :style="{ backgroundImage: `url(${show.thumbnail})` }"></div>
        <div class="card-meta">
          <p>{{ show.title }}</p>
        </div>
      </router-link>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { shows } from '../data/videos'

const showVideos = computed(() => shows)
const heroSlides = computed(() => showVideos.value)
const activeIndex = ref(0)
let slideTimer = null

function heroSlideStyle(show, index) {
  return {
    backgroundImage: `linear-gradient(to top, rgba(20,20,20,1) 12%, rgba(20,20,20,0.2) 45%, rgba(20,20,20,0)), url(${show.banner || ''})`,
    transform: `translateX(${(index - activeIndex.value) * 100}%)`
  }
}

function nextSlide() {
  activeIndex.value = (activeIndex.value + 1) % heroSlides.value.length
}

function setSlide(index) {
  activeIndex.value = index
}

const heroStyle = computed(() => ({
  backgroundImage: `linear-gradient(to top, rgba(20,20,20,1) 20%, rgba(20,20,20,0.4) 55%, rgba(20,20,20,0) 100%), url(${heroSlides.value[activeIndex.value]?.banner || ''})`
}))

onMounted(() => {
  slideTimer = setInterval(nextSlide, 4500)
})

onBeforeUnmount(() => {
  clearInterval(slideTimer)
})
</script>

<style scoped>
.series-page {
  background: #141414;
  color: #fff;
}
.series-hero {
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
.series-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(20, 20, 20, 1) 20%, rgba(20, 20, 20, 0.4) 55%, rgba(20, 20, 20, 0) 100%);
}
.series-hero-content {
  position: relative;
  max-width: 640px;
  z-index: 1;
}
.series-hero-content h1 {
  margin: 0;
  font-size: clamp(2.4rem, 4vw, 4.8rem);
}
.series-hero-content p {
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
.series-grid {
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
  .series-hero {
    padding: 36px 24px;
  }
  .series-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
    padding: 28px 24px 36px;
  }
}
@media (max-width: 700px) {
  .series-hero {
    min-height: 42vh;
    padding: 24px 18px;
  }
  .series-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }
}
</style>

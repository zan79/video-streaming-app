<template>
  <div class="show-page">
    <div class="show-header" :style="headerStyle">
      <div class="show-hero-carousel">
        <div
          v-for="(slide, index) in heroSlides"
          :key="slide.id"
          class="show-slide"
          :style="slideStyle(slide, index)"
        ></div>
      </div>
      <button class="back-btn" @click="goBack">← Back</button>
      <div class="show-summary">
        <span class="show-category">{{ show.category }}</span>
        <h1>{{ show.title }}</h1>
        <p class="show-description">{{ show.description }}</p>
        <div class="show-slide-dots">
          <button
            v-for="(slide, index) in heroSlides"
            :key="slide.id"
            :class="['slide-dot', { active: index === slideIndex }]"
            @click="setSlide(index)"
            aria-label="Select slide"
          ></button>
        </div>
      </div>
    </div>

    <div class="show-grid">
      <section class="show-player-panel">
        <div class="episode-card">
          <div class="episode-top">
            <div>
              <span class="episode-tag">Now Playing</span>
              <h2>{{ episode.title }}</h2>
              <p class="episode-meta">{{ episode.duration }} · {{ episode.views }} views</p>
            </div>
          </div>

          <VideoPlayer :source="episode" />

          <div class="episode-description">
            <h3>Episode Overview</h3>
            <p>{{ episode.description }}</p>
          </div>
        </div>

        <div class="episode-list-grid">
          <h3>All Episodes</h3>
          <div class="episode-grid">
            <button
              v-for="ep in show.episodes"
              :key="ep.id"
              :class="['episode-link', { active: ep.id === episode.id }]"
              @click="selectEpisode(ep)"
            >
              <span>{{ ep.title }}</span>
              <small>{{ ep.duration }}</small>
            </button>
          </div>
        </div>
      </section>

      <aside class="show-sidebar">
        <div class="up-next-panel">
          <h3>Next Episodes</h3>
          <div class="up-next-list">
            <button
              v-for="ep in nextEpisodes"
              :key="ep.id"
              class="up-next-item"
              @click="selectEpisode(ep)"
            >
              <div>
                <strong>{{ ep.title }}</strong>
                <p>{{ ep.duration }}</p>
              </div>
              <span>▶</span>
            </button>
            <p v-if="!nextEpisodes.length" class="empty-state">No next episodes available.</p>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import VideoPlayer from '../components/VideoPlayer.vue'
import { shows } from '../data/videos'

const router = useRouter()
const route = useRoute()
const showId = computed(() => Number(route.params.id))
const selectedEpisodeId = ref(null)
const slideIndex = ref(0)

const show = computed(() => {
  return shows.find(item => item.id === showId.value) || shows[0]
})

const episode = computed(() => {
  const current = show.value.episodes.find(item => item.id === selectedEpisodeId.value)
  return current || show.value.episodes[0]
})

const heroSlides = computed(() => show.value.episodes || [])

const headerStyle = computed(() => ({
  backgroundImage: `linear-gradient(to top, rgba(20,20,20,0.95), rgba(20,20,20,0.65)), url(${show.value.banner || ''})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
}))

function slideStyle(slide, index) {
  return {
    backgroundImage: `linear-gradient(to top, rgba(20,20,20,0.95), rgba(20,20,20,0.65)), url(${slide.thumbnail || show.value.banner || ''})`,
    transform: `translateX(${(index - slideIndex.value) * 100}%)`
  }
}

const nextEpisodes = computed(() => {
  const index = show.value.episodes.findIndex(item => item.id === episode.value.id)
  return index >= 0 ? show.value.episodes.slice(index + 1) : []
})

watch(
  show,
  value => {
    selectedEpisodeId.value = value.episodes?.[0]?.id || null
    slideIndex.value = 0
  },
  { immediate: true }
)

function selectEpisode(ep) {
  selectedEpisodeId.value = ep.id
}

function setSlide(index) {
  slideIndex.value = index
}

function nextSlide() {
  if (!heroSlides.value.length) {
    return
  }
  slideIndex.value = (slideIndex.value + 1) % heroSlides.value.length
}

onMounted(() => {
  const interval = setInterval(nextSlide, 4500)
  onBeforeUnmount(() => clearInterval(interval))
})

function goBack() {
  router.push({ name: 'series' })
}
</script>

<style scoped>
.show-page {
  padding: 32px 48px 48px;
  background: #141414;
  color: #fff;
}
.show-header {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 32px;
  padding: 3rem 2rem;
  border-radius: 28px;
  overflow: hidden;
  color: #fff;
}
.show-hero-carousel {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.show-slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transition: transform 0.8s ease;
  will-change: transform;
}
.show-header::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(10, 10, 10, 0.95), rgba(10, 10, 10, 0.15));
  pointer-events: none;
}
.back-btn {
  position: relative;
  z-index: 1;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  padding: 12px 18px;
  border-radius: 10px;
  cursor: pointer;
}
.show-summary {
  position: relative;
  z-index: 1;
  max-width: 860px;
}
.show-slide-dots {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
.slide-dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.15);
  cursor: pointer;
}
.slide-dot.active {
  background: #e50914;
  border-color: #e50914;
}
.show-category {
  display: inline-flex;
  margin-bottom: 12px;
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  font-size: 0.82rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.show-summary h1 {
  margin: 0 0 14px;
  font-size: clamp(2rem, 3vw, 3.4rem);
}
.show-description {
  margin: 0;
  color: #ddd;
  line-height: 1.7;
  max-width: 70ch;
}
.show-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(320px, 0.9fr);
  gap: 28px;
}
.show-player-panel,
.show-sidebar {
  background: #0f0f0f;
  border-radius: 24px;
  padding: 24px;
}
.episode-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.episode-top {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-start;
}
.episode-tag {
  display: inline-flex;
  background: rgba(229, 9, 20, 0.14);
  color: #e50914;
  border-radius: 999px;
  padding: 8px 14px;
  font-weight: 700;
  font-size: 0.82rem;
}
.episode-top h2 {
  margin: 12px 0 6px;
  font-size: 1.8rem;
}
.episode-meta {
  color: #aaaaaa;
  margin: 0;
}
.episode-description {
  background: #111;
  border-radius: 20px;
  padding: 18px;
}
.episode-description h3 {
  margin: 0 0 10px;
}
.episode-description p {
  margin: 0;
  color: #d3d3d3;
  line-height: 1.7;
}
.episode-list-grid {
  margin-top: 24px;
}
.episode-list-grid h3 {
  margin-bottom: 18px;
}
.episode-grid {
  display: grid;
  gap: 12px;
}
.episode-link {
  width: 100%;
  text-align: left;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #111;
  color: #fff;
  border-radius: 16px;
  padding: 16px 18px;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.episode-link:hover,
.episode-link.active {
  transform: translateX(2px);
  border-color: #e50914;
}
.episode-link span {
  display: block;
  font-weight: 600;
}
.episode-link small {
  color: #aaa;
}
.show-sidebar h3 {
  margin: 0 0 18px;
}
.up-next-list {
  display: grid;
  gap: 12px;
}
.up-next-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #111;
  color: #fff;
  border-radius: 16px;
  padding: 14px 16px;
  cursor: pointer;
}
.up-next-item:hover {
  border-color: #e50914;
}
.up-next-item strong {
  display: block;
  font-size: 0.98rem;
}
.up-next-item p {
  margin: 4px 0 0;
  font-size: 0.85rem;
  color: #bbb;
}
.empty-state {
  margin: 0;
  color: #777;
}
@media (max-width: 980px) {
  .show-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 700px) {
  .show-page {
    padding: 22px 18px 24px;
  }
  .show-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

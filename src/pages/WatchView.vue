<template>
  <div class="watch-page">
    <div class="watch-header">
      <button class="back-btn" @click="goBack">← Back</button>
      <h2>{{ source.title }}</h2>
    </div>

    <div class="watch-layout">
      <div class="watch-player">
        <VideoPlayer :source="source" />
      </div>

      <div class="watch-details">
        <p class="watch-category">{{ source.category }}</p>
        <p class="watch-meta">{{ source.channel ? `${source.channel} · ` : '' }}{{ source.views }} views</p>
        <p class="watch-description">{{ source.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import VideoPlayer from '../components/VideoPlayer.vue'
import { videos, shows } from '../data/videos'

const router = useRouter()
const route = useRoute()
const videoId = Number(route.params.id)

const source = computed(() => {
  const video = videos.find(video => video.id === videoId)
  if (video) return video

  for (const show of shows) {
    const episode = show.episodes.find(ep => ep.id === videoId)
    if (episode) {
      return {
        ...episode,
        category: 'Series',
        channel: show.channel,
        views: episode.views || show.views,
        description: episode.description || show.description,
      }
    }
  }

  return videos[0]
})

function goBack() {
  const destination = source.value.category === 'Movies' ? 'movies' : 'series'
  router.push({ name: destination })
}
</script>

<style scoped>
.watch-page {
  padding: 32px 48px 48px;
  background: #141414;
  color: #fff;
}
.watch-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}
.back-btn {
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
}
.watch-layout {
  display: grid;
  grid-template-columns: 1.5fr 0.9fr;
  gap: 28px;
}
.watch-player {
  background: #000;
  border-radius: 24px;
  padding: 24px;
}
.watch-details {
  background: #111;
  border-radius: 24px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.watch-category {
  color: #e50914;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin: 0;
}
.watch-meta {
  margin: 0;
  color: #ccc;
}
.watch-description {
  margin: 0;
  line-height: 1.6;
}
@media (max-width: 900px) {
  .watch-layout {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 700px) {
  .watch-page {
    padding: 24px 18px 24px;
  }
}
</style>

<template>
  <div class="watch-page">
    <div class="watch-header">
      <button class="back-btn" @click="goBack">↩ back</button>
      <h1>{{ source.title }}</h1>
    </div>

    <div class="watch-layout">
      <div class="watch-player">
        <VideoPlayer :source="source" />
      </div>

      <div class="watch-details">
        <!-- <p v-if="source.category" class="watch-category">{{ source.category }}</p>
        <p class="watch-meta">{{ source.channel ? `${source.channel} · ` : '' }}{{ source.views }} views</p>
        <p class="watch-description">{{ source.description }}</p> -->

        <div v-if="isMovie" class="watch-related">
          <h2>Other Movies</h2>
          <ul class="related-list">
            <li v-for="movie in relatedMovies" :key="movie.id" @click="selectSource(movie.id)" class="related-item">
              <span>{{ movie.title }}</span>
              <span class="related-meta">{{ movie.views }} views</span>
            </li>
          </ul>
        </div>

        <div v-else-if="currentShow" class="watch-related">
          <h2>Episodes</h2>
          <ul class="related-list">
            <li v-for="episode in showEpisodes" :key="episode.id" @click="selectSource(episode.id)" :class="{'active-episode': episode.id === videoId}" class="related-item">
              <span>{{ episode.title }}</span>
              <span class="related-meta">{{ episode.duration }} · {{ episode.views }} views</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import VideoPlayer from '../components/VideoPlayer.vue'
import { videos, shows } from '../data/videos'

const router = useRouter()
const route = useRoute()
const videoId = computed(() => Number(route.params.id))

const source = computed(() => {
  const video = videos.find(video => video.id === videoId.value)
  if (video) return video

  for (const show of shows) {
    const episode = show.episodes.find(ep => ep.id === videoId.value)
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

const isMovie = computed(() => videos.some(video => video.id === videoId.value))
const currentShow = computed(() => shows.find(show => show.episodes.some(ep => ep.id === videoId.value)))
const relatedMovies = computed(() => videos.filter(video => video.id !== videoId.value))
const showEpisodes = computed(() => currentShow.value?.episodes || [])

function selectSource(id) {
  router.push({ name: 'watch', params: { id } })
}

function goBack() {
  const destination = isMovie.value ? 'movies' : 'series'
  router.push({ name: destination })
}
</script>

<style scoped>
.watch-page {
  padding: 2px 48px 36px;
  background: #141414;
  color: #fff;
}
.watch-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 14px;
  padding: 10px 0;
  /* margin-bottom: 18px; */
}
.watch-header h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
}
.back-btn {
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  padding: 8px 14px;
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
  padding: 5px;
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
.watch-related {
  /* margin-top: 24px; */
}
.watch-related h2 {
  margin: 0 0 12px;
  font-size: 1.05rem;
  color: #e50914;
}
.related-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;
}
.related-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease;
}
.related-item:hover,
.related-item.active-episode {
  background: rgba(255, 255, 255, 0.1);
}
.related-meta {
  color: #aaa;
  font-size: 0.9rem;
}
@media (max-width: 900px) {
  .watch-layout {
    grid-template-columns: 1fr;
    gap: 22px;
  }
}
@media (max-width: 700px) {
  .watch-page {
    padding: 16px 14px 18px;
  }

  .watch-header {
    flex-wrap: wrap;
    gap: 10px;
    padding: 8px 0;
    margin-bottom: 16px;
  }

  .watch-header h1 {
    font-size: 1.35rem;
    line-height: 1.2;
  }

  .back-btn {
    padding: 8px 12px;
  }

  .watch-layout {
    gap: 18px;
  }

  .watch-player,
  .watch-details {
    width: 100%;
  }

  .watch-player {
    padding: 0;
    border-radius: 20px;
  }

  .watch-details {
    padding: 18px;
    border-radius: 20px;
  }

  .watch-related {
    margin-top: 14px;
  }

  .related-list {
    max-height: 240px;
  }
}
</style>

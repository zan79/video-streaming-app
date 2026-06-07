<template>
  <div class="video-card">
    <div class="video-header">
      <div>
        <h2>{{ source.title }}</h2>
        <div class="video-meta-row">
          <span>{{ source.channel }}</span>
          <span>•</span>
          <span>{{ source.views }} views</span>
        </div>
      </div>
      <div class="video-actions">
        <button type="button">Like</button>
        <button type="button">Share</button>
        <button type="button">Save</button>
      </div>
    </div>

    <video
      ref="videoElement"
      controls
      playsinline
      preload="metadata"
      class="video-player"
    ></video>

    <div class="video-description">
      <p>{{ source.description }}</p>
      <p class="video-source">Source URL: <a :href="source.url" target="_blank" rel="noreferrer">Open stream</a></p>
    </div>
  </div>
</template>

<script>
import Hls from 'hls.js'
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

export default {
  name: 'VideoPlayer',
  props: {
    source: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const videoElement = ref(null)
    let hls = null

    const attachSource = () => {
      const video = videoElement.value
      if (!video || !props.source) return

      if (hls) {
        hls.destroy()
        hls = null
      }

      video.pause()
      video.src = ''

      const isHls = props.source.url.endsWith('.m3u8')
      if (isHls && Hls.isSupported()) {
        hls = new Hls()
        hls.loadSource(props.source.url)
        hls.attachMedia(video)
      } else {
        video.src = props.source.url
      }

      video.load()
      video.play().catch(() => {
        // Playback may be blocked until user interaction.
      })
    }

    watch(
      () => props.source,
      () => {
        attachSource()
      },
      { immediate: true }
    )

    onMounted(() => {
      attachSource()
    })

    onBeforeUnmount(() => {
      if (hls) {
        hls.destroy()
      }
    })

    return {
      videoElement
    }
  }
}
</script>

<style scoped>
.video-card {
  background: #000;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.video-header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}
.video-header h2 {
  margin: 0 0 10px;
  font-size: clamp(1.5rem, 2vw, 2rem);
  color: #fff;
}
.video-meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  color: #ccc;
  font-size: 0.95rem;
}
.video-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.video-actions button {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  background: #111;
  color: #fff;
  padding: 10px 16px;
  cursor: pointer;
}
.video-actions button:hover {
  background: #ff0000;
}
.video-player {
  width: 100%;
  aspect-ratio: 16 / 9;
  min-height: 280px;
  border-radius: 20px;
  background: #000;
  object-fit: cover;
}
.video-description {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.video-description p {
  margin: 0;
  line-height: 1.7;
  color: #fff;
}
.video-source a {
  color: #ff0000;
  text-decoration: none;
}
.video-source a:hover {
  text-decoration: underline;
}
@media (max-width: 640px) {
  .video-card {
    padding: 18px;
  }

  .video-actions {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>

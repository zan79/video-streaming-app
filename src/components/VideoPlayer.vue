<template>
  <div>
    <div class="video-container">
      <iframe
        v-if="isGoogleDriveUrl"
        :src="getGoogleDriveEmbedUrl"
        class="video-player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
      <video
        v-else
        ref="videoElement"
        controls
        playsinline
        preload="metadata"
        class="video-player"
      ></video>
    </div>

  </div>
</template>

<script>
import Hls from 'hls.js'
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'

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

    const isGoogleDriveUrl = computed(() => {
      if (!props.source?.url) return false
      return props.source.url.includes('drive.google.com')
    })

    const getGoogleDriveEmbedUrl = computed(() => {
      if (!isGoogleDriveUrl.value) return ''
      
      const url = props.source.url
      let fileId = null

      // Extract file ID from various Google Drive URL formats
      const patterns = [
        /\/d\/([a-zA-Z0-9-_]+)/,  // /d/{FILE_ID}
        /id=([a-zA-Z0-9-_]+)/     // ?id={FILE_ID}
      ]

      for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) {
          fileId = match[1]
          break
        }
      }

      if (!fileId) return ''
      
      return `https://drive.google.com/file/d/${fileId}/preview`
    })

    const attachSource = () => {
      const video = videoElement.value
      if (!video || !props.source || isGoogleDriveUrl.value) return

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
      videoElement,
      isGoogleDriveUrl,
      getGoogleDriveEmbedUrl
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
.video-title {
  margin: 0;
  font-size: clamp(1.75rem, 2.2vw, 2.5rem);
  color: #fff;
}
.video-container {
  position: relative;
  width: 100%;
  max-width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 20px;
  background: #000;
  overflow: hidden;
}
.video-player {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
  border-radius: inherit;
  background: #000;
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
@media (max-width: 640px) {
  .video-card {
    padding: 8px;
  }

  .video-player {
    border-radius: 16px;
  }
}

@media (max-width: 520px) {
  .video-player {
    border-radius: 14px;
  }
}

@media (max-width: 420px) {
  .video-player {
    border-radius: 12px;
  }
}
</style>

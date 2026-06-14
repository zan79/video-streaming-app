<template>
  <div>
    <div class="video-container">
      <iframe
        v-if="isEmbeddedVideo"
        :src="embedUrl"
        class="video-player"
        allowfullscreen
        allow="autoplay; encrypted-media"
      ></iframe>

      <div v-else class="unsupported-video">
        Video source is not supported.
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'VideoPlayer',
  props: {
    source: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const isEmbeddedVideo = computed(() => {
      const url = props.source?.download_url.replace("/d/","/e/") || ''

      return (
        url.includes('playmogo.com') ||
        url.includes('drive.google.com')
      )
    })

    const embedUrl = computed(() => {
      return isEmbeddedVideo.value
        ? props.source.download_url.replace("/d/","/e/")
        : ''
    })

    return {
      isEmbeddedVideo,
      embedUrl
    }
  }
}
</script>
<style scoped>
.video-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.video-player {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}
</style>
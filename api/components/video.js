// Video Caching
const videoCache = {}

function cacheVideo(url) {
  if (!videoCache[url]) {
    const video = document.createElement('video')
    video.src = url
    video.load()
    videoCache[url] = video
  }
  return videoCache[url]
}

// Usage example
const videoUrl = 'https://www.youtube-nocookie.com/embed/jnr4o4G3wtg?si=PeQU4FX5ObmMMtDj'
const cachedVideo = cacheVideo(videoUrl)

// Image Caching
const imageCache = {}

function cacheImage(url) {
  if (!imageCache[url]) {
    const img = new Image()
    img.src = url
    imageCache[url] = img
  }
  return imageCache[url]
}

// Usage example
const imageUrl = 'https://hl2reboot.vercel.app/assets/img/video.jpg'
const cachedImage = cacheImage(imageUrl)

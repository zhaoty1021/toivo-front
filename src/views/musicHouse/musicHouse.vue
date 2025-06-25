<template>
  <div class="music-house-container" :class="theme">
    <div class="music-house-card">
      <!-- 页面标题区域 -->
      <div class="music-header">
        <h1 class="title">我的音乐空间</h1>
        <div class="music-underline"></div>
      </div>

      <!-- 搜索框 -->
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索歌曲..."
          class="search-input"
          @input="handleSearch"
        />
        <svg-icon name="search" class="search-icon" />
      </div>

      <!-- 音乐分类导航 -->
      <div class="music-category-nav">
        <div
          v-for="category in categories"
          :key="category.id"
          class="category-item"
          :class="{ active: activeCategory === category.id }"
          @click="activeCategory = category.id"
        >
          <component :is="category.icon" class="category-icon" />
          <span class="category-name">{{ category.name }}</span>
        </div>
      </div>

      <!-- 音乐播放器 -->
      <div class="music-player" v-if="currentTrack">
        <div class="player-info">
          <div
            class="album-cover"
            :style="{ backgroundImage: `url(${currentTrack.cover})` }"
            :class="{ 'rotate-animation': isPlaying }"
          >
            <div class="play-pause-overlay" @click="togglePlay">
              <component :is="isPlaying ? 'Pause' : 'Play'" class="play-icon" />
            </div>
          </div>
          <div class="track-info">
            <h3 class="track-name">{{ currentTrack.name }}</h3>
            <p class="track-artist">{{ currentTrack.artist }}</p>
          </div>
        </div>

        <!-- 歌词显示区域 -->
        <div class="lyrics-container" ref="lyricsContainer" v-if="isPlaying">
          <div class="lyrics-wrapper">
            <div
              v-for="(line, index) in lyrics"
              :key="index"
              class="lyric-line"
              :class="{ active: currentLyricIndex === index }"
            >
              {{ line.text }}
            </div>
          </div>
        </div>

        <div class="player-controls">
          <div class="progress-container" @click="setProgress">
            <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
          </div>
          <div class="time-info">
            <span class="current-time">{{ formatTime(currentTime) }}</span>
            <span class="duration">{{
              formatTime(currentTrack.duration)
            }}</span>
          </div>
          <div class="control-buttons">
            <button @click="prevTrack" class="control-btn">
              <SkipBack class="control-icon" />
            </button>
            <button @click="togglePlay" class="control-btn play-btn">
              <svg-icon
                :name="isPlaying ? 'pause' : 'play'"
                class="control-icon"
              />
            </button>
            <button @click="nextTrack" class="control-btn">
              <SkipForward class="control-icon" />
            </button>
          </div>
        </div>
      </div>

      <!-- 音乐列表 -->
      <div class="music-tracks-grid">
        <div
          v-for="track in filteredTracks"
          :key="track.id"
          class="track-card"
          :class="{
            'active-track': currentTrack && currentTrack.id === track.id,
          }"
          @click="playTrack(track)"
        >
          <div
            class="track-cover"
            :style="{ backgroundImage: `url(${track.cover})` }"
          >
            <div class="play-overlay">
              <svg-icon
                :name="
                  currentTrack && currentTrack.id === track.id && isPlaying
                    ? 'pause'
                    : 'play'
                "
                class="overlay-icon"
              />
            </div>
          </div>
          <div class="track-card-info">
            <h3 class="track-card-name">{{ track.name }}</h3>
            <p class="track-card-artist">{{ track.artist }}</p>
          </div>
          <div class="track-meta">
            <span class="track-duration">{{ formatTime(track.duration) }}</span>
            <div class="track-actions">
              <Heart
                :class="['action-icon', { liked: track.liked }]"
                @click.stop="toggleLike(track)"
              />
              <ListPlus
                class="action-icon"
                @click.stop="addToPlaylist(track)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject, watch, nextTick } from "vue";
import { recommendSongs, getMusicUrl, getLyric } from "@/api/music";
import { useLikeMusicListStore } from "@/store/likeMusicListStore";
import {
  Music,
  Headphones,
  Radio,
  Mic2,
  Heart,
  ListPlus,
  Play,
  Pause,
  SkipBack,
  SkipForward,
} from "lucide-vue-next";

// 主题设置
const theme = ref(inject("theme", "dark"));

// 音乐分类
const categories = ref([
  { id: "like", name: "我喜欢", icon: Music },
  { id: "pop", name: "流行", icon: Headphones },
  { id: "rock", name: "摇滚", icon: Radio },
  { id: "jazz", name: "爵士", icon: Mic2 },
]);

const activeCategory = ref("like");

// 音乐数据
const tracks = ref([]);
const currentTrack = ref(null);
const isPlaying = ref(false);
const audioElement = ref(null);
const currentTime = ref(0);
const progress = ref(0);
const likeMusicStore = useLikeMusicListStore();

// 歌词相关
const lyrics = ref([]);
const currentLyricIndex = ref(-1);
const lyricsContainer = ref(null);

// 解析歌词
const parseLyrics = (lyricString) => {
  if (!lyricString) return [];

  const lines = lyricString.split("\n");
  const result = [];
  const timeRegex = /\[(\d+):(\d+(?:\.\d+)?)\](.*)/;

  for (const line of lines) {
    const match = timeRegex.exec(line);
    if (match) {
      const minutes = parseInt(match[1]);
      const seconds = parseFloat(match[2]);
      const time = minutes * 60 + seconds;
      const text = match[3].trim();

      if (text) {
        result.push({ time, text });
      }
    }
  }

  return result.sort((a, b) => a.time - b.time);
};

// 更新当前歌词
const updateCurrentLyric = () => {
  if (!audioElement.value || !currentTrack.value || lyrics.value.length === 0)
    return;

  const currentAudioTime = audioElement.value.currentTime;
  let newIndex = -1;

  for (let i = 0; i < lyrics.value.length; i++) {
    if (currentAudioTime >= lyrics.value[i].time) {
      newIndex = i;
    } else {
      break;
    }
  }

  if (newIndex !== currentLyricIndex.value) {
    currentLyricIndex.value = newIndex;
    scrollToCurrentLyric();
  }
};

// 滚动到当前歌词
const scrollToCurrentLyric = () => {
  nextTick(() => {
    const container = lyricsContainer.value;
    const activeLine = container?.querySelector(".lyric-line.active");

    if (container && activeLine) {
      const lineOffsetTop = activeLine.offsetTop;
      const offset = activeLine.clientHeight * 14.5;

      container.scrollTo({
        top: lineOffsetTop - offset,
        behavior: "smooth",
      });
    }
  });
};

// 初始化音频元素
const initAudioElement = () => {
  if (!audioElement.value) {
    audioElement.value = new Audio();
    audioElement.value.volume = 0.7;

    audioElement.value.addEventListener("timeupdate", () => {
      currentTime.value = audioElement.value.currentTime;
      progress.value = (currentTime.value / currentTrack.value.duration) * 100;
      updateCurrentLyric();
    });

    audioElement.value.addEventListener("ended", nextTrack);
  }
};

// 播放特定音乐
const playTrack = async (track) => {
  if (currentTrack.value && currentTrack.value.id === track.id) {
    togglePlay();
    return;
  }

  currentTrack.value = track;
  currentTime.value = 0;
  progress.value = 0;

  // 加载歌词
  try {
    const lyricResponse = await getLyric(track.id);
    if (lyricResponse.code === 200) {
      track.lyric = lyricResponse.lrc.lyric;
      lyrics.value = parseLyrics(track.lyric);
      currentLyricIndex.value = -1;
    }
  } catch (error) {
    console.error("获取歌词失败:", error);
    lyrics.value = [];
  }

  // 初始化音频
  if (!audioElement.value) {
    initAudioElement();
  }

  // 设置音频源
  try {
    const urlResponse = await getMusicUrl(track.id);
    if (urlResponse) {
      const url = urlResponse.find((u) => u.id === track.id)?.url;
      if (url) {
        audioElement.value.src = url;
        play();
      }
    }
  } catch (error) {
    console.error("获取音乐URL失败:", error);
  }
};

// 播放控制
const play = () => {
  if (!audioElement.value || !currentTrack.value) return;

  audioElement.value
    .play()
    .then(() => {
      isPlaying.value = true;
    })
    .catch((error) => {
      console.error("播放失败:", error);
      isPlaying.value = false;
    });
};

const pause = () => {
  if (audioElement.value) {
    audioElement.value.pause();
    isPlaying.value = false;
  }
};

const togglePlay = () => {
  if (isPlaying.value) {
    pause();
  } else {
    play();
  }
};

// 上一首/下一首
const prevTrack = () => {
  if (!currentTrack.value || tracks.value.length === 0) return;

  const currentIndex = tracks.value.findIndex(
    (t) => t.id === currentTrack.value.id
  );
  const newIndex =
    (currentIndex - 1 + tracks.value.length) % tracks.value.length;
  playTrack(tracks.value[newIndex]);
};

const nextTrack = () => {
  if (!currentTrack.value || tracks.value.length === 0) return;

  const currentIndex = tracks.value.findIndex(
    (t) => t.id === currentTrack.value.id
  );
  const newIndex = (currentIndex + 1) % tracks.value.length;
  playTrack(tracks.value[newIndex]);
};

// 设置进度
const setProgress = (e) => {
  if (!audioElement.value || !currentTrack.value) return;

  const progressBar = e.currentTarget;
  const clickPosition =
    (e.clientX - progressBar.getBoundingClientRect().left) /
    progressBar.clientWidth;
  const newTime = clickPosition * currentTrack.value.duration;

  audioElement.value.currentTime = newTime;
  currentTime.value = newTime;
  progress.value = clickPosition * 100;
};

// 其他功能
const toggleLike = (track) => {
  track.liked = !track.liked;
};

const addToPlaylist = (track) => {
  console.log("添加到播放列表:", track.name);
};

// 格式化时间
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" + secs : secs}`;
};

// 搜索相关
const searchQuery = ref("");
const originalTracks = ref([]); // 保存原始音乐列表

// 修改 filteredTracks 计算属性以包含搜索功能
const filteredTracks = computed(() => {
  let result = [...tracks.value];

  // 应用分类筛选
  if (activeCategory.value !== "like") {
    result = result.filter((track) => track.category === activeCategory.value);
  }

  // 应用搜索筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (track) =>
        track.name.toLowerCase().includes(query) ||
        track.artist.toLowerCase().includes(query)
    );
  }

  return result;
});

// 搜索处理函数
const handleSearch = () => {
  // 如果搜索框为空，恢复原始列表
  if (!searchQuery.value.trim()) {
    tracks.value = [...originalTracks.value];
  }
};

// 初始化
onMounted(async () => {
  await likeMusicStore.fetchLikeMusicList();
  console.log("喜欢的音乐列表:", likeMusicStore.likeList);
  // 确保 tracks.value 是数组
  tracks.value = Array.isArray(likeMusicStore.likeList)
    ? [...likeMusicStore.likeList]
    : [];

  originalTracks.value = [...tracks.value];
});

// 清理
onBeforeUnmount(() => {
  if (audioElement.value) {
    audioElement.value.pause();
    audioElement.value.src = "";
    audioElement.value = null;
  }
});
</script>

<style lang="scss" scoped>
.music-house-container {
  --primary-color: #6200ea;
  --secondary-color: #b388ff;
  --accent-color: #3f51b5;
  --bg-color: #f5f7fa;
  --card-bg: #ffffff;
  --text-color: #333344;
  --border-color: rgba(98, 0, 234, 0.2);
  --hover-bg: rgba(98, 0, 234, 0.05);
  --active-bg: rgba(98, 0, 234, 0.1);
  --player-bg: rgba(98, 0, 234, 0.05);
  --lyric-active: #6200ea;
  --lyric-inactive: rgba(51, 51, 68, 0.7);

  display: flex;
  justify-content: center;
  min-height: 100vh;
  padding: 1.5rem;
  font-family: "Inter", "PingFang SC", sans-serif;
  background-color: var(--bg-color);
  margin-top: 70px;

  &.dark {
    --primary-color: #bb86fc;
    --secondary-color: #8c9eff;
    --accent-color: #03dac6;
    --bg-color: #121212;
    --card-bg: #1e1e1e;
    --text-color: #e0e0e0;
    --border-color: rgba(187, 134, 252, 0.3);
    --hover-bg: rgba(187, 134, 252, 0.1);
    --active-bg: rgba(187, 134, 252, 0.2);
    --player-bg: rgba(30, 30, 30, 0.8);
    --lyric-active: #bb86fc;
    --lyric-inactive: rgba(224, 224, 224, 0.7);
  }

  .music-house-card {
    width: 100%;
    max-width: 1200px;
    background-color: var(--card-bg);
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--border-color);
    overflow: hidden;
    position: relative;

    .music-header {
      text-align: center;
      margin-bottom: 1.5rem;
      position: relative;

      .title {
        font-size: 2.2rem;
        font-weight: 700;
        color: var(--primary-color);
        margin-bottom: 0.5rem;
        text-shadow: 0 0 10px rgba(98, 0, 234, 0.2);
      }

      .music-underline {
        height: 3px;
        background: linear-gradient(
          90deg,
          transparent,
          var(--primary-color),
          var(--secondary-color),
          transparent
        );
        margin: 0 auto;
        width: 120px;
        border-radius: 3px;
      }
    }

    .search-container {
      position: relative;
      margin-bottom: 1.5rem;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;

      .search-input {
        width: 100%;
        padding: 0.75rem 1rem 0.75rem 2.5rem;
        border-radius: 25px;
        border: 1px solid var(--border-color);
        background-color: var(--card-bg);
        color: var(--text-color);
        font-size: 0.95rem;
        transition: all 0.3s ease;

        &:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(98, 0, 234, 0.1);
        }
      }

      .search-icon {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        width: 18px;
        height: 18px;
        color: var(--text-color);
        opacity: 0.7;
      }
    }

    .music-category-nav {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2rem;
      padding: 1rem;
      background-color: var(--hover-bg);
      border-radius: 12px;
      border: 1px solid var(--border-color);

      .category-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.8rem 1.2rem;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 1px solid var(--border-color);
        background-color: var(--card-bg);

        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        &.active {
          background-color: var(--primary-color);
          border-color: var(--primary-color);
          box-shadow: 0 5px 15px rgba(98, 0, 234, 0.2);

          .category-icon,
          .category-name {
            color: white;
          }
        }

        .category-icon {
          width: 20px;
          height: 20px;
          color: var(--primary-color);
        }

        .category-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-color);
        }
      }
    }

    .music-player {
      background-color: var(--player-bg);
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      .player-info {
        display: flex;
        align-items: center;
        gap: 1.5rem;

        .album-cover {
          width: 100px;
          height: 100px;
          border-radius: 12px;
          background-size: cover;
          background-position: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          flex-shrink: 0;

          .play-pause-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            cursor: pointer;

            &:hover {
              opacity: 1;
            }

            .play-icon {
              color: white;
              width: 40px;
              height: 40px;
            }
          }
        }

        .track-info {
          flex-grow: 1;

          .track-name {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-color);
            margin-bottom: 0.5rem;
          }

          .track-artist {
            font-size: 1rem;
            color: var(--text-color);
            opacity: 0.8;
          }
        }
      }

      /* 歌词容器样式 */
      .lyrics-container {
        height: 120px;
        margin: 10px 0;
        overflow-y: auto;
        scroll-behavior: smooth;
        text-align: center;
        padding: 10px;
        border-radius: 8px;
        background-color: var(--hover-bg);
        border: 1px solid var(--border-color);
      }

      .lyrics-wrapper {
        padding: 30px 0;
      }

      .lyric-line {
        padding: 6px 0;
        font-size: 0.9rem;
        line-height: 1.5;
        color: var(--lyric-inactive);
        transition: all 0.3s ease;
      }

      .lyric-line.active {
        font-size: 1.1rem;
        font-weight: bold;
        color: var(--lyric-active);
        text-shadow: 0 0 10px rgba(var(--primary-rgb), 0.5);
      }

      .player-controls {
        .progress-container {
          height: 6px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 0.5rem;
          cursor: pointer;

          .progress-bar {
            height: 100%;
            background: linear-gradient(
              90deg,
              var(--primary-color),
              var(--secondary-color)
            );
            border-radius: 3px;
            transition: width 0.1s linear;
          }
        }

        .time-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--text-color);
          opacity: 0.7;
          margin-bottom: 1rem;
        }

        .control-buttons {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1.5rem;

          .control-btn {
            background: none;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: all 0.3s ease;
            background-color: var(--hover-bg);

            &:hover {
              background-color: var(--active-bg);
              transform: scale(1.1);
            }

            .control-icon {
              width: 20px;
              height: 20px;
              color: var(--text-color);
            }
          }

          .play-btn {
            width: 50px;
            height: 50px;
            background-color: var(--primary-color);

            &:hover {
              background-color: var(--primary-color);
              opacity: 0.9;
            }

            .control-icon {
              color: white;
            }
          }
        }
      }
    }

    .music-tracks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1.5rem;
      margin-top: 1rem;

      .track-card {
        background-color: var(--card-bg);
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.3s ease;
        border: 1px solid var(--border-color);
        cursor: pointer;
        position: relative;

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          border-color: var(--primary-color);
        }

        &.active-track {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px var(--primary-color);
        }

        .track-cover {
          width: 100%;
          height: 180px;
          background-size: cover;
          background-position: center;
          position: relative;

          .play-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;

            .overlay-icon {
              color: white;
              width: 40px;
              height: 40px;
            }
          }
        }

        &:hover .play-overlay {
          opacity: 1;
        }

        .track-card-info {
          padding: 1rem;

          .track-card-name {
            font-size: 1rem;
            font-weight: 600;
            color: var(--text-color);
            margin-bottom: 0.3rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .track-card-artist {
            font-size: 0.85rem;
            color: var(--text-color);
            opacity: 0.7;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .track-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 1rem 1rem;
          font-size: 0.8rem;

          .track-duration {
            color: var(--text-color);
            opacity: 0.6;
          }

          .track-actions {
            display: flex;
            gap: 0.8rem;

            .action-icon {
              width: 18px;
              height: 18px;
              color: var(--text-color);
              opacity: 0.6;
              transition: all 0.3s ease;
              cursor: pointer;

              &:hover {
                opacity: 1;
                transform: scale(1.1);
              }

              &.liked {
                color: #ff4d4f;
                opacity: 1;
                fill: #ff4d4f;
              }
            }
          }
        }
      }
    }
  }
}

/* 旋转动画 */
.rotate-animation {
  animation: rotate 10s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .music-house-container {
    padding: 1rem;
    margin-top: 60px;

    .music-house-card {
      padding: 1rem;

      .music-header .title {
        font-size: 1.8rem;
      }

      .music-category-nav {
        gap: 0.5rem;
        padding: 0.5rem;

        .category-item {
          padding: 0.5rem 0.8rem;
        }
      }

      .music-player {
        padding: 1rem;

        .player-info {
          flex-direction: column;
          text-align: center;

          .album-cover {
            width: 150px;
            height: 150px;
          }
        }
      }

      .music-tracks-grid {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 1rem;
      }
    }
  }
}

@media (max-width: 480px) {
  .music-house-container {
    .music-house-card {
      .music-tracks-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
  }
}
</style>

<template>
  <div class="tech-music-player" :class="theme">
    <!-- 迷你模式 -->
    <div class="mini-mode" @click.stop="toggleExpand">
      <img
        :src="currentTrack.cover"
        class="album-cover"
        :class="{ 'rotate-animation': isPlaying }"
        alt="Album Cover"
      />
      <div class="track-info">
        <div class="title">{{ currentTrack.title }}</div>
        <div class="artist">{{ currentTrack.artist }}</div>
      </div>
      <button class="play-btn" @click.stop="togglePlay">
        <svg class="icon" viewBox="0 0 24 24">
          <path v-if="isPlaying" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          <path v-else d="M8 5v14l11-7z" />
        </svg>
      </button>
    </div>

    <!-- 扩展模式 -->
    <transition name="expand">
      <div v-if="isExpanded" class="expanded-mode">
        <div class="cover-art">
          <img
            :src="currentTrack.cover"
            class="cover-image"
            :class="{ 'rotate-animation': isPlaying }"
            alt="Album Cover"
          />
          <div class="glow-effect" :style="glowStyle"></div>
        </div>

        <!-- 歌词显示区域 -->
        <div class="lyrics-container" ref="lyricsContainer">
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
          <button class="control-btn" @click.stop="prevTrack">
            <svg class="icon" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          <button class="main-play-btn" @click.stop="togglePlay">
            <svg class="icon" viewBox="0 0 24 24">
              <path v-if="isPlaying" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              <path v-else d="M8 5v14l11-7z" />
            </svg>
          </button>

          <button class="control-btn" @click.stop="nextTrack">
            <svg class="icon" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>
        </div>

        <div class="volume-control">
          <svg class="icon" viewBox="0 0 24 24">
            <path
              d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
            />
          </svg>
          <input
            type="range"
            v-model="volume"
            min="0"
            max="1"
            step="0.01"
            class="volume-slider"
            @click.stop
          />
        </div>
      </div>
    </transition>

    <!-- 调试信息（开发环境显示） -->
    <div v-if="isDev" class="debug-info">
      <p>播放状态: {{ isPlaying ? "播放中" : "暂停" }}</p>
      <p>当前曲目: {{ currentTrackIndex + 1 }}/{{ playlist.length }}</p>
      <p>音量: {{ Math.round(volume * 100) }}%</p>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
} from "vue";
import { recommendSongs, getMusicUrl, getLyric } from "@/api/music";
const theme = inject("theme");

// 播放列表数据
const playlist = ref([
  {
    id: 1,
    title: "海阔天空",
    artist: "Beyond",
    cover:
      "http://singerimg.kugou.com/v2/singer_portrait/20150114/20150114161200436.jpg",
    src: "http://fs.youthandroid2.kugou.com/202505162017/9052125dc58c9cf5e6f4fe95cdd21866/v3/a9d96dd193bbde6f59de4af9903af005/yp/p_0_960173/ap3116_us0_df-_mi336d5ebc5436534e61d16e63ddfca327_pi411_qu128_mx62299734__s1552696293.mp3",
    lyric:
      "[00:00.00]海阔天空 - Beyond\n[00:05.00]词：黄家驹\n[00:10.00]曲：黄家驹\n[00:15.00]编曲：Beyond/梁邦彦\n[00:20.00]\n[00:30.00]今天我 寒夜里看雪飘过\n[00:36.00]怀着冷却了的心窝漂远方\n[00:43.00]风雨里追赶 雾里分不清影踪\n[00:50.00]天空海阔你与我 可会变\n[00:56.00]多少次 迎着冷眼与嘲笑\n[01:03.00]从没有放弃过心中的理想\n[01:10.00]一刹那恍惚 若有所失的感觉\n[01:17.00]不知不觉已变淡 心里爱\n[01:23.00]原谅我这一生不羁放纵爱自由\n[01:30.00]也会怕有一天会跌倒\n[01:36.00]背弃了理想 谁人都可以\n[01:43.00]哪会怕有一天只你共我\n[02:17.00]仍然自由自我 永远高唱我歌\n[02:23.00]走遍千里\n[02:30.00]原谅我这一生不羁放纵爱自由\n[02:36.00]也会怕有一天会跌倒\n[02:43.00]背弃了理想 谁人都可以\n[02:50.00]哪会怕有一天只你共我\n[02:56.00]背弃了理想 谁人都可以\n[03:03.00]哪会怕有一天只你共我\n[03:10.00]原谅我这一生不羁放纵爱自由\n[03:16.00]也会怕有一天会跌倒\n[03:23.00]背弃了理想 谁人都可以\n[03:30.00]哪会怕有一天只你共我",
  },
  {
    id: 2,
    title: "光辉岁月",
    artist: "Beyond",
    cover:
      "http://singerimg.kugou.com/v2/singer_portrait/20150114/20150114161200436.jpg",
    src: "https://music.163.com/song/media/outer/url?id=346576.mp3",
    lyric:
      "[00:00.00]光辉岁月 - Beyond\n[00:05.00]词：黄家驹\n[00:10.00]曲：黄家驹\n[00:15.00]编曲：Beyond\n[00:20.00]\n[00:30.00]钟声响起归家的讯号\n[00:37.00]在他生命里 仿佛带点唏嘘\n[00:44.00]黑色肌肤给他的意义\n[00:51.00]是一生奉献 肤色斗争中\n[00:58.00]年月把拥有变做失去\n[01:05.00]疲倦的双眼带着期望\n[01:12.00]今天只有残留的躯壳\n[01:19.00]迎接光辉岁月\n[01:22.00]风雨中抱紧自由\n[01:26.00]一生经过彷徨的挣扎\n[01:33.00]自信可改变未来\n[01:36.00]问谁又能做到\n[01:40.00]可否不分肤色的界限\n[01:47.00]愿这土地里 不分你我高低\n[01:54.00]缤纷色彩闪出的美丽\n[02:01.00]是因它没有 分开每种色彩\n[02:08.00]年月把拥有变做失去\n[02:15.00]疲倦的双眼带着期望\n[02:22.00]今天只有残留的躯壳\n[02:29.00]迎接光辉岁月\n[02:32.00]风雨中抱紧自由\n[02:36.00]一生经过彷徨的挣扎\n[02:43.00]自信可改变未来\n[02:46.00]问谁又能做到\n[03:17.00]今天只有残留的躯壳\n[03:24.00]迎接光辉岁月\n[03:27.00]风雨中抱紧自由\n[03:31.00]一生经过彷徨的挣扎\n[03:38.00]自信可改变未来\n[03:41.00]问谁又能做到\n[03:45.00]今天只有残留的躯壳\n[03:52.00]迎接光辉岁月\n[03:55.00]风雨中抱紧自由\n[03:59.00]一生经过彷徨的挣扎\n[04:06.00]自信可改变未来\n[04:09.00]问谁又能做到",
  },
]);

// 播放器核心状态
const currentTrackIndex = ref(0);
const currentTrack = computed(() => playlist.value[currentTrackIndex.value]);
const isPlaying = ref(false);
const isExpanded = ref(false);
const volume = ref(0.7);
const audioElement = ref(null);
const isDev = process.env.NODE_ENV === "development";

// 歌词相关状态
const lyrics = ref([]);
const currentLyricIndex = ref(-1);
const lyricsContainer = ref(null);
const lyricUpdateInterval = ref(null);

// 光效样式
const glowStyle = computed(() => ({
  backgroundColor:
    theme === "dark" ? "rgba(51, 181, 255, 0.2)" : "rgba(0, 136, 255, 0.2)",
  boxShadow: `0 0 30px ${theme === "dark" ? "#33b5ff" : "#0088ff"}`,
}));

// 解析歌词
// 解析歌词
const parseLyrics = (lyricString) => {
  if (!lyricString) return [];

  const lines = lyricString.split("\n");
  const result = [];

  // 匹配 [mm:ss.sss] 或 [mm:ss.sss] 后面有空格的情况
  const timeRegex = /\[(\d+):(\d+(?:\.\d+)?)\](.*)/;

  for (const line of lines) {
    const match = timeRegex.exec(line);
    if (match) {
      const minutes = parseInt(match[1]);
      const seconds = parseInt(match[2]);
      const time = minutes * 60 + seconds;

      // 获取歌词文本（去掉时间标记）
      const text = match[3].trim();

      // 只有当有实际歌词内容时才添加
      if (text) {
        // 检查是否已经存在相同时间的歌词
        const existingIndex = result.findIndex(
          (item) => Math.abs(item.time - time) < 0.01
        );

        if (existingIndex === -1) {
          result.push({ time, text });
        } else {
          // 合并相同时间的歌词（如作词、作曲信息）
          result[existingIndex].text += "\n" + text;
        }
      }
    }
  }

  // 按时间排序
  result.sort((a, b) => a.time - b.time);

  return result;
};

// 更新当前歌词
const updateCurrentLyric = () => {
  if (!audioElement.value || lyrics.value.length === 0) return;

  const currentTime = audioElement.value.currentTime;
  let newIndex = -1;

  // 找到当前时间对应的歌词
  for (let i = 0; i < lyrics.value.length; i++) {
    if (currentTime >= lyrics.value[i].time) {
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
      const offset = activeLine.clientHeight * 8; // 可以根据你歌词行高度适当调整，减少滚动幅度

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
    audioElement.value.volume = volume.value;

    // 设置事件监听
    audioElement.value.addEventListener("ended", () => {
      isPlaying.value = false;
      nextTrack();
    });

    audioElement.value.addEventListener("play", () => {
      isPlaying.value = true;
      startLyricUpdate();
    });

    audioElement.value.addEventListener("pause", () => {
      isPlaying.value = false;
      stopLyricUpdate();
    });

    audioElement.value.addEventListener("error", (error) => {
      console.error("音频播放错误:", error);
      isPlaying.value = false;
      stopLyricUpdate();
    });

    audioElement.value.addEventListener("timeupdate", updateCurrentLyric);
  }
};

// 开始歌词更新
const startLyricUpdate = () => {
  stopLyricUpdate();
  lyricUpdateInterval.value = setInterval(updateCurrentLyric, 200);
};

// 停止歌词更新
const stopLyricUpdate = () => {
  if (lyricUpdateInterval.value) {
    clearInterval(lyricUpdateInterval.value);
    lyricUpdateInterval.value = null;
  }
};

// 加载曲目
const loadTrack = (index = currentTrackIndex.value) => {
  if (index < 0 || index >= playlist.value.length) return;

  // 更新索引
  currentTrackIndex.value = index;

  // 停止当前播放
  if (isPlaying.value) {
    audioElement.value.pause();
    isPlaying.value = false;
  }

  // 设置新音频源
  audioElement.value.src = currentTrack.value.src;
};

// 播放控制函数
const play = () => {
  if (!audioElement.value.src) {
    audioElement.value.src = currentTrack.value.src;
  }

  audioElement.value
    .play()
    .then(() => {
      isPlaying.value = true;
      startLyricUpdate();
    })
    .catch((error) => {
      console.error("播放失败:", error);
      isPlaying.value = false;
    });
};

const pause = () => {
  audioElement.value.pause();
  isPlaying.value = false;
  stopLyricUpdate();
};

// 统一的播放/暂停切换函数
const togglePlay = (event) => {
  if (event) event.stopPropagation();

  if (isPlaying.value) {
    pause();
  } else {
    play();
  }
};

// 上一首
const prevTrack = () => {
  const newIndex =
    (currentTrackIndex.value - 1 + playlist.value.length) %
    playlist.value.length;
  loadTrack(newIndex);
  initMusicLyric();
  play();
};

// 下一首
const nextTrack = () => {
  const newIndex = (currentTrackIndex.value + 1) % playlist.value.length;
  loadTrack(newIndex);
  initMusicLyric();

  play();
};

// 展开/收起
const toggleExpand = (event) => {
  if (event) event.stopPropagation();
  isExpanded.value = !isExpanded.value;
};

// 处理点击事件
const handleOutsideClick = (event) => {
  const player = document.querySelector(".tech-music-player");
  if (player && !player.contains(event.target) && isExpanded.value) {
    isExpanded.value = false;
  }
};

// 搜索音乐
const recommendMusic = async () => {
  try {
    const response = await recommendSongs();
    if (response) {
      const idList = response.dailySongs.map((song) => song.id).join(",");
      const urlResponse = await getMusicUrl(idList);

      if (urlResponse) {
        playlist.value = response.dailySongs.map((song) => ({
          id: song.id,
          title: song.name,
          artist: song.ar[0].name,
          cover: song.al.picUrl,
          src: urlResponse.find((u) => u.id === song.id)?.url || "",
        }));

        currentTrackIndex.value = 0;
        loadTrack(0);
      }
    }
  } catch (error) {
    console.error("获取推荐音乐失败:", error);
  }
};

const initMusicLyric = async () => {
  if (currentTrack.value) {
    const lyricResponse = await getLyric(currentTrack.value.id);
    if (lyricResponse) {
      console.log("歌词响应:", lyricResponse);
      currentTrack.value.lyric = lyricResponse.lrc.lyric;
      lyrics.value = parseLyrics(currentTrack.value.lyric);
      currentLyricIndex.value = -1;
      //currentLyricIndex.value = -1;
    } else {
      currentTrack.value.lyric = "";
    }
  } else {
    currentTrack.value.lyric = "";
  }
  // 解析歌词
};

// 生命周期钩子
onMounted(async () => {
  initAudioElement();
  document.addEventListener("click", handleOutsideClick);
  await recommendMusic();
  loadTrack(0);
  initMusicLyric();
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleOutsideClick);
  stopLyricUpdate();

  if (audioElement.value) {
    audioElement.value.pause();
    audioElement.value.src = "";
    audioElement.value.removeEventListener("timeupdate", updateCurrentLyric);
  }
});

// 监听器
watch(volume, (val) => {
  if (audioElement.value) {
    audioElement.value.volume = val;
  }
});
</script>

<style lang="scss" scoped>
.tech-music-player {
  --primary-color: #0088ff;
  --primary-rgb: 0, 136, 255;
  --secondary-color: #00aaff;
  --bg-color: white;
  --text-color: black;
  --text-secondary: rgba(0, 0, 0, 0.7);
  &.dark {
    --primary-color: #33b5ff;
    --primary-rgb: 51, 181, 255;
    --bg-color: rgba(20, 30, 40, 0.95);
    --text-color: #ffffff;
    --text-secondary: rgba(255, 255, 255, 0.7);
    --card-bg: rgba(30, 30, 60, 0.5);
  }

  position: fixed;
  left: 20px;
  bottom: 20px;
  z-index: 1000;
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--primary-rgb), 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  background: var(--bg-color);
  transition: all 0.3s ease;
  width: 300px;

  font-family: "Segoe UI", sans-serif;
}

/* 迷你模式 */
.mini-mode {
  display: flex;
  align-items: center;
  padding: 12px;
  cursor: pointer;
  gap: 12px;
  transition: all 0.3s ease;
}

.mini-mode:hover {
  background: rgba(255, 255, 255, 0.05);
}

.album-cover {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(var(--primary-rgb), 0.5);
  transition: all 0.3s ease;
}

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

.track-info {
  flex: 1;
  min-width: 0;
}

.track-info .title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-info .artist {
  font-size: 12px;
  color: var(--text-secondary);
}

.play-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(var(--primary-rgb), 0.2);
  border: 1px solid rgba(var(--primary-rgb), 0.5);
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.play-btn:hover {
  background: rgba(var(--primary-rgb), 0.3);
  transform: scale(1.05);
}

.icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

/* 扩展模式 */
.expanded-mode {
  padding: 20px;
  animation: expandFade 0.3s ease;
}

@keyframes expandFade {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cover-art {
  position: relative;
  width: 180px;
  height: 180px;
  margin: 0 auto 20px;
}

.cover-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  position: relative;
  z-index: 2;
  border: 2px solid rgba(var(--primary-rgb), 0.5);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.glow-effect {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 50%;
  filter: blur(20px);
  z-index: 1;
  opacity: 0.7;
  transition: all 0.5s ease;
}

/* 歌词容器 */
.lyrics-container {
  height: 120px;
  margin: 20px 0;
  overflow-y: auto;
  scroll-behavior: smooth;
  text-align: center;
  color: var(--text-color);
}

.lyrics-wrapper {
  padding: 60px 0;
}

.lyric-line {
  padding: 8px 0;
  font-size: 16px;
  line-height: 1.5;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.lyric-line.active {
  font-size: 18px;
  font-weight: bold;
  color: var(--primary-color);
  text-shadow: 0 0 10px rgba(var(--primary-rgb), 0.5);
}

.player-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin: 20px 0;
}

.control-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.control-btn:hover {
  background: rgba(var(--primary-rgb), 0.2);
  transform: scale(1.05);
}

.main-play-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(var(--primary-rgb), 0.3);
  border: 2px solid var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.main-play-btn:hover {
  background: rgba(var(--primary-rgb), 0.4);
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(var(--primary-rgb), 0.5);
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
}

.volume-slider {
  flex: 1;
  height: 4px;
  accent-color: var(--primary-color);
  cursor: pointer;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.2);
}

/* 调试信息 */
.debug-info {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  font-size: 12px;
  color: white;
}

.debug-info p {
  margin: 5px 0;
}
</style>

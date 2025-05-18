<template>
  <div class="game-universe" :class="theme">
    <div class="star-field">
      <div
        v-for="i in 50"
        :key="i"
        class="star"
        :style="randomStarPosition()"
      ></div>
    </div>

    <div class="game-showcase">
      <!-- 页面标题区域 -->
      <div class="showcase-header">
        <div class="title-area">
          <h1 class="main-title">游戏宇宙探索</h1>
          <p class="subtitle">发现值得你时间的精彩游戏</p>
        </div>

        <div class="filter-controls">
          <div class="search-box">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="搜索游戏..."
              class="search-input"
            />
            <Search class="search-icon" />
          </div>

          <div class="view-toggle">
            <button
              class="toggle-btn"
              :class="{ active: viewMode === 'grid' }"
              @click="viewMode = 'grid'"
            >
              <Grid class="toggle-icon" />
            </button>
            <button
              class="toggle-btn"
              :class="{ active: viewMode === 'list' }"
              @click="viewMode = 'list'"
            >
              <List class="toggle-icon" />
            </button>
          </div>
        </div>
      </div>

      <!-- 分类标签 -->
      <div class="category-tags">
        <div
          v-for="category in categories"
          :key="category.id"
          class="category-tag"
          :class="{ active: activeCategory === category.id }"
          @click="toggleCategory(category.id)"
        >
          <component :is="category.icon" class="tag-icon" />
          <span>{{ category.name }}</span>
        </div>
      </div>

      <!-- 游戏卡片区域 -->
      <div class="games-container" :class="viewMode">
        <div
          v-for="game in filteredGames"
          :key="game.id"
          class="game-card"
          @click="navigateToGameDetail(game.id)"
          :style="getCardStyle(game)"
        >
          <div class="card-banner">
            <img :src="game.banner" :alt="game.title" class="banner-img" />
          </div>

          <div class="card-content">
            <div class="game-score">{{ game.score }}/10</div>
            <div class="spacer"></div>
            <h3 class="game-title">{{ game.title }}</h3>

            <div class="game-meta">
              <span class="release-year">{{ game.release }}</span>
              <span class="platform-icons">
                <img
                  v-for="platform in getPlatformIcons(game.platforms)"
                  :key="platform"
                  :src="platformIcon(platform)"
                  :alt="platform"
                  class="platform-icon"
                />
              </span>
            </div>

            <p class="game-description">{{ game.description }}</p>

            <div class="game-tags">
              <span
                v-for="tag in game.tags"
                :key="tag"
                class="game-tag"
                :style="{ backgroundColor: getTagColor(tag) }"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <div class="card-glow"></div>
        </div>
      </div>

      <!-- 底部区域 -->
      <div class="showcase-footer">
        <p>
          已显示 {{ filteredGames.length }} 款游戏，共有 {{ games.length }} 款
        </p>
        <button
          class="more-btn"
          v-if="filteredGames.length < games.length"
          @click="loadMore"
        >
          加载更多
          <ChevronDown class="more-icon" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import { useRouter } from "vue-router";
import {
  Search,
  Grid,
  List,
  ChevronDown,
  Gamepad,
  Crosshair,
  Map,
  Brain,
  Users,
  Sword,
  Car,
  Building,
  Skull,
  Puzzle,
} from "lucide-vue-next";

const router = useRouter();
const theme = inject("theme", "dark");
const viewMode = ref("grid");
const searchQuery = ref("");
const activeCategory = ref("all");
const displayLimit = ref(12);

// 平台图标映射
const platformIcons = {
  pc: "pc",
  ps5: "ps5",
  ps4: "ps5",
  xbox: "xbox",
  xsx: "xbox",
  xone: "xbox",
  switch: "switch",
  mobile: "phone",
};

const platformIcon = (platform) => {
  const icon = platformIcons[platform] || "unknown";
  return new URL(`/src/assets/platform-icons/${icon}.svg`, import.meta.url)
    .href;
};

// 分类数据
const categories = ref([
  { id: "all", name: "全部", icon: Gamepad },
  { id: "action", name: "动作", icon: Crosshair },
  { id: "adventure", name: "冒险", icon: Map },
  { id: "strategy", name: "策略", icon: Brain },
  { id: "rpg", name: "角色扮演", icon: Sword },
  { id: "simulation", name: "模拟", icon: Building },
  { id: "sports", name: "体育", icon: Users },
  { id: "racing", name: "竞速", icon: Car },
  { id: "puzzle", name: "解谜", icon: Puzzle },
  { id: "horror", name: "恐怖", icon: Skull },
]);

// 游戏数据
const games = ref([
  {
    id: "elden-ring",
    title: "艾尔登法环",
    description:
      "一款由FromSoftware开发的开放世界动作角色扮演游戏，融合了黑暗奇幻元素和挑战性的战斗系统。",
    banner: "http://124.70.85.121:9000/t-blog/game/cover/elder_ring.png",
    score: 9.6,
    release: "2022",
    categories: ["action", "rpg", "adventure"],
    platforms: ["pc", "ps5", "xsx"],
    tags: ["开放世界", "黑暗奇幻", "高难度", "魂系列"],
  },
  {
    id: "baldurs-gate-3",
    title: "博德之门3",
    description:
      "由Larian Studios开发的回合制角色扮演游戏，基于龙与地下城世界观，提供丰富的故事线和角色扮演选择。",
    banner: "/api/placeholder/480/270",
    score: 9.8,
    release: "2023",
    categories: ["rpg", "strategy"],
    platforms: ["pc", "ps5"],
    tags: ["回合制", "龙与地下城", "选择与后果", "角色扮演"],
  },
  {
    id: "cyberpunk-2077",
    title: "赛博朋克2077",
    description:
      "一款由CD Projekt RED开发的开放世界动作冒险游戏，设定在高科技低生活的未来世界中。",
    banner: "http://124.70.85.121:9000/t-blog/game/cover/cyberpunk-2077.png",
    score: 8.5,
    release: "2020",
    categories: ["action", "rpg", "adventure"],
    platforms: ["pc", "ps5", "xsx"],
    tags: ["开放世界", "科幻", "第一人称", "剧情"],
  },
  {
    id: "zelda-totk",
    title: "塞尔达传说: 王国之泪",
    description:
      "任天堂出品的开放世界冒险游戏，是《旷野之息》的续作，玩家可以探索天空与地底世界。",
    banner: "/api/placeholder/480/270",
    score: 9.5,
    release: "2023",
    categories: ["adventure", "action"],
    platforms: ["switch"],
    tags: ["开放世界", "解谜", "探索", "创造"],
  },
  {
    id: "god-of-war-ragnarok",
    title: "战神: 诸神黄昏",
    description:
      "由Santa Monica工作室开发的动作冒险游戏，继续讲述奎托斯和阿特柔斯在北欧神话世界的故事。",
    banner: "/api/placeholder/480/270",
    score: 9.4,
    release: "2022",
    categories: ["action", "adventure"],
    platforms: ["ps5", "ps4"],
    tags: ["北欧神话", "动作", "剧情", "单人"],
  },
  {
    id: "rdr2",
    title: "荒野大镖客: 救赎2",
    description:
      "Rockstar Games出品的开放世界西部动作冒险游戏，以其逼真的世界和引人入胜的故事著称。",
    banner: "/api/placeholder/480/270",
    score: 9.7,
    release: "2018",
    categories: ["action", "adventure"],
    platforms: ["pc", "ps4", "xone"],
    tags: ["开放世界", "西部", "剧情", "沙盒"],
  },
  {
    id: "minecraft",
    title: "我的世界",
    description:
      "一款沙盒建造游戏，玩家可以在方块构成的3D世界中自由建造和探索。",
    banner: "/api/placeholder/480/270",
    score: 9.0,
    release: "2011",
    categories: ["adventure", "simulation"],
    platforms: ["pc", "mobile"],
    tags: ["沙盒", "建造", "生存", "多人"],
  },
  {
    id: "hades",
    title: "哈迪斯",
    description:
      "Supergiant Games出品的roguelike动作游戏，结合了希腊神话和高速战斗，深受好评。",
    banner: "/api/placeholder/480/270",
    score: 9.3,
    release: "2020",
    categories: ["action", "rpg"],
    platforms: ["pc", "switch", "ps5"],
    tags: ["roguelike", "希腊神话", "动作", "地牢"],
  },
  {
    id: "civilization-6",
    title: "文明VI",
    description:
      "经典4X策略游戏系列的第六代作品，玩家可以建立和发展自己的文明，从古代一直到未来。",
    banner: "/api/placeholder/480/270",
    score: 9.0,
    release: "2016",
    categories: ["strategy"],
    platforms: ["pc", "switch", "mobile"],
    tags: ["回合制", "历史", "4X", "多人"],
  },
  {
    id: "hollow-knight",
    title: "空洞骑士",
    description:
      "一款由Team Cherry开发的2D动作冒险游戏，以其精美的艺术风格和挑战性的战斗著称。",
    banner: "/api/placeholder/480/270",
    score: 9.2,
    release: "2017",
    categories: ["action", "adventure", "puzzle"],
    platforms: ["pc", "switch", "ps4"],
    tags: ["银河恶魔城", "黑暗", "挑战", "独立游戏"],
  },
  {
    id: "halo-infinite",
    title: "光环: 无限",
    description:
      "由343 Industries开发的第一人称射击游戏，作为光环系列的最新作品，延续了士官长的故事。",
    banner: "/api/placeholder/480/270",
    score: 8.7,
    release: "2021",
    categories: ["action"],
    platforms: ["pc", "xsx", "xone"],
    tags: ["FPS", "科幻", "多人", "开放世界"],
  },
  {
    id: "among-us",
    title: "在我们之间",
    description: "一款多人社交推理游戏，玩家需要找出隐藏在船员中的内鬼。",
    banner: "/api/placeholder/480/270",
    score: 8.0,
    release: "2018",
    categories: ["strategy", "puzzle"],
    platforms: ["pc", "mobile"],
    tags: ["多人", "推理", "社交", "派对游戏"],
  },
  {
    id: "genshin-impact",
    title: "原神",
    description:
      "由米哈游开发的开放世界动作角色扮演游戏，融合了动漫风格和元素战斗系统。",
    banner: "/api/placeholder/480/270",
    score: 8.5,
    release: "2020",
    categories: ["rpg", "adventure"],
    platforms: ["pc", "mobile", "ps5"],
    tags: ["开放世界", "元素战斗", "动漫风格", "免费游戏"],
  },
  {
    id: "hitman-3",
    title: "杀手3",
    description:
      "IO Interactive开发的隐匿动作游戏，玩家扮演特工47，在精心设计的场景中完成各种暗杀任务。",
    banner: "/api/placeholder/480/270",
    score: 8.8,
    release: "2021",
    categories: ["action", "adventure", "strategy"],
    platforms: ["pc", "ps5", "xsx"],
    tags: ["隐匿", "暗杀", "沙盒", "第三人称"],
  },
  {
    id: "stardew-valley",
    title: "星露谷物语",
    description:
      "由ConcernedApe单人开发的农场模拟游戏，玩家可以经营农场、探索洞穴、与村民建立关系。",
    banner: "/api/placeholder/480/270",
    score: 9.1,
    release: "2016",
    categories: ["simulation", "rpg"],
    platforms: ["pc", "mobile"],
    tags: ["农场", "生活模拟", "像素", "独立游戏"],
  },
  {
    id: "rocket-league",
    title: "火箭联盟",
    description:
      "一款将足球与赛车结合的体育游戏，玩家控制火箭动力车辆在场上比赛。",
    banner: "/api/placeholder/480/270",
    score: 8.6,
    release: "2015",
    categories: ["sports", "racing"],
    platforms: ["pc", "ps5", "xsx"],
    tags: ["足球", "赛车", "多人", "电子竞技"],
  },
  {
    id: "hfw",
    title: "地平线: 西部禁域",
    description:
      "由Guerrilla Games开发的开放世界动作角色扮演游戏，讲述了阿洛伊在后末世界的冒险。",
    banner: "/api/placeholder/480/270",
    score: 9.0,
    release: "2022",
    categories: ["action", "adventure", "rpg"],
    platforms: ["pc", "ps5", "ps4"],
    tags: ["开放世界", "后末世界", "机械生物", "弓箭"],
  },
  {
    id: "sekiro",
    title: "只狼: 影逝二度",
    description:
      "FromSoftware开发的动作冒险游戏，设定在架空的战国时代日本，以精确的战斗系统著称。",
    banner: "/api/placeholder/480/270",
    score: 9.3,
    release: "2019",
    categories: ["action", "adventure"],
    platforms: ["pc", "ps4", "xone"],
    tags: ["忍者", "高难度", "战国", "弹反"],
  },
]);

// 获取平台图标
const getPlatformIcons = (platforms) => {
  return platforms.filter((platform) => platformIcons[platform]);
};

// 获取卡片样式
const getCardStyle = (game) => {
  // 根据游戏ID生成稳定的颜色
  const hash = game.id
    .split("")
    .reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  const hue = Math.abs(hash % 360);
  const color = `hsl(${hue}, 70%, 50%)`;

  return {
    "--card-color": color,
    "--card-bg": `linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7))`,
  };
};

// 根据标签获取背景颜色
const getTagColor = (tag) => {
  const hash = tag
    .split("")
    .reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  const hue = Math.abs(hash % 360);
  return `hsla(${hue}, 70%, 60%, 0.2)`;
};

// 随机星星位置
const randomStarPosition = () => {
  const x = Math.floor(Math.random() * 100);
  const y = Math.floor(Math.random() * 100);
  const size = Math.floor(Math.random() * 2) + 1;
  const duration = Math.random() * 5 + 3;

  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDuration: `${duration}s`,
  };
};

// 过滤游戏列表
const filteredGames = computed(() => {
  let result = games.value;

  if (activeCategory.value !== "all") {
    result = result.filter((game) =>
      game.categories.includes(activeCategory.value)
    );
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (game) =>
        game.title.toLowerCase().includes(query) ||
        game.description.toLowerCase().includes(query) ||
        game.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  return result.slice(0, displayLimit.value);
});

// 切换分类
const toggleCategory = (categoryId) => {
  activeCategory.value = categoryId;
};

// 加载更多游戏
const loadMore = () => {
  displayLimit.value += 8;
};

// 跳转到游戏详情页
const navigateToGameDetail = (gameId) => {
  router.push(`/game/${gameId}`);
};
</script>

<style lang="scss" scoped>
.game-universe {
  --primary-color: #7928ca;
  --secondary-color: #ff0080;
  --accent-color: #00cffd;
  --bg-color: #0f1322;
  --text-color: #ffffff;
  --text-secondary: #b0b7c3;
  --border-color: rgba(3, 2, 2, 0.1);
  --hover-bg: rgba(121, 40, 202, 0.1);
  --active-bg: rgba(121, 40, 202, 0.2);

  min-height: 100vh;
  padding: 2rem;
  background-color: var(--bg-color);
  color: var(--text-color);
  font-family: "Montserrat", "SF Pro Display", "PingFang SC", sans-serif;
  position: relative;
  overflow: hidden;
  margin-top: 70px;

  &.light {
    --primary-color: #7928ca;
    --secondary-color: #ff0080;
    --accent-color: #00cffd;
    --bg-color: #f8f9fa;
    --text-color: #121212;
    --text-secondary: #4d4d4d;
    --border-color: rgba(0, 0, 0, 0.1);
    --hover-bg: rgba(121, 40, 202, 0.05);
    --active-bg: rgba(121, 40, 202, 0.1);
  }

  .star-field {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;

    .star {
      position: absolute;
      background-color: #ffffff;
      border-radius: 50%;
      opacity: 0.6;
      animation: twinkle 5s infinite;
    }

    @keyframes twinkle {
      0%,
      100% {
        opacity: 0.6;
      }
      50% {
        opacity: 0.2;
      }
    }
  }

  .game-showcase {
    position: relative;
    z-index: 1;
    max-width: 1600px;
    margin: 0 auto;

    .showcase-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;

      .title-area {
        .main-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0;
          background: linear-gradient(
            45deg,
            var(--primary-color),
            var(--secondary-color),
            var(--accent-color)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 300% 300%;
          animation: gradient-shift 10s ease infinite;
        }

        .subtitle {
          font-size: 1rem;
          color: var(--text-secondary);
          margin-top: 0.5rem;
        }

        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      }

      .filter-controls {
        display: flex;
        gap: 1rem;
        align-items: center;

        .search-box {
          position: relative;

          .search-input {
            background-color: var(--bg-color);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 0.7rem 1rem 0.7rem 2.5rem;
            color: var(--text-color);
            width: 240px;
            font-size: 0.9rem;

            &:focus {
              outline: none;
              border-color: var(--primary-color);
              box-shadow: 0 0 0 3px rgba(121, 40, 202, 0.2);
            }
          }

          .search-icon {
            position: absolute;
            left: 0.7rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-secondary);
            width: 18px;
            height: 18px;
          }
        }

        .view-toggle {
          display: flex;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid var(--border-color);

          .toggle-btn {
            background-color: var(--bg-color);
            border: none;
            padding: 0.5rem;
            cursor: pointer;
            color: var(--text-secondary);
            display: flex;
            align-items: center;
            justify-content: center;

            &:hover {
              background-color: var(--hover-bg);
            }

            &.active {
              background-color: var(--active-bg);
              color: var(--primary-color);
            }

            .toggle-icon {
              width: 18px;
              height: 18px;
            }
          }
        }
      }
    }

    .category-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.8rem;
      margin-bottom: 2rem;

      .category-tag {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.7rem 1rem;
        background-color: var(--bg-color);
        border-radius: 30px;
        border: 1px solid var(--border-color);
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.9rem;
        font-weight: 600;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        &.active {
          background: linear-gradient(
            135deg,
            var(--primary-color),
            var(--secondary-color)
          );
          border-color: transparent;
          color: white;
          box-shadow: 0 5px 15px rgba(121, 40, 202, 0.3);
        }

        .tag-icon {
          width: 16px;
          height: 16px;
        }
      }
    }

    .games-container {
      margin-bottom: 2rem;

      &.grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.8rem;
      }

      &.list {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;

        .game-card {
          flex-direction: row;
          height: auto;

          .card-banner {
            width: 100%;
            height: 100%;
          }
        }
      }

      .game-card {
        position: relative;
        border-radius: 16px;
        overflow: hidden;
        transition: all 0.3s ease;
        cursor: pointer;
        height: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);

          .card-glow {
            opacity: 1;
          }

          .banner-img {
            transform: scale(1.05);
          }
        }

        .card-banner {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;

          .banner-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
          }
        }

        .card-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          padding: 1.5rem;
          background: var(--card-bg);
          color: white;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
          overflow: visible;
          .spacer {
            flex-grow: 0.85;
            min-height: 1rem; /* 控制上方空余大小 */
          }

          .game-score {
            position: absolute;
            top: 10px;
            right: 10px;
            background: linear-gradient(
              135deg,
              var(--primary-color),
              var(--secondary-color)
            );
            color: white;
            font-weight: 700;
            padding: 0.4rem 0.8rem;
            border-radius: 20px;
            font-size: 0.8rem;
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
          }

          .game-title {
            font-size: 1.5rem;
            font-weight: 800;
            margin: 0 0 0.5rem;
          }

          .game-meta {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0.8rem;
            font-size: 0.9rem;

            .release-year {
              background-color: rgba(255, 255, 255, 0.2);
              padding: 0.3rem 0.7rem;
              border-radius: 4px;
            }

            .platform-icons {
              display: flex;
              gap: 0.5rem;

              .platform-icon {
                width: 18px;
                height: 18px;
                color: white;
              }
            }
          }

          .game-description {
            font-size: 0.85rem;
            line-height: 1.5;
            margin-bottom: 1rem;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .game-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;

            .game-tag {
              padding: 0.3rem 0.7rem;
              border-radius: 4px;
              font-size: 0.8rem;
              font-weight: 600;
              backdrop-filter: blur(5px);
              border: 1px solid rgba(255, 255, 255, 0.2);
            }
          }
        }

        .card-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at var(--x, 50%) var(--y, 50%),
            rgba(255, 255, 255, 0.1) 0%,
            transparent 60%
          );
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
          z-index: 1;
        }
      }
    }

    .showcase-footer {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      gap: 1rem;
      color: var(--text-secondary);
      font-size: 0.9rem;
      padding: 2rem 0;

      .more-btn {
        background: linear-gradient(
          135deg,
          var(--primary-color),
          var(--secondary-color)
        );
        color: white;
        border: none;
        padding: 0.8rem 2rem;
        border-radius: 30px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.2s ease;
        box-shadow: 0 5px 15px rgba(121, 40, 202, 0.3);

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(121, 40, 202, 0.4);
        }

        .more-icon {
          width: 16px;
          height: 16px;
        }
      }
    }
  }
}

@media (max-width: 1024px) {
  .game-universe {
    padding: 1.5rem;

    .game-showcase {
      .showcase-header {
        flex-direction: column;
        align-items: flex-start;

        .filter-controls {
          width: 100%;

          .search-box {
            flex-grow: 1;

            .search-input {
              width: 100%;
            }
          }
        }
      }

      .games-container {
        &.grid {
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .game-universe {
    padding: 1rem;

    .game-showcase {
      .category-tags {
        flex-wrap: nowrap;
        overflow-x: auto;
        padding-bottom: 0.5rem;

        &::-webkit-scrollbar {
          height: 3px;
        }

        &::-webkit-scrollbar-thumb {
          background-color: var(--primary-color);
          border-radius: 3px;
        }
      }

      .games-container {
        &.list {
          .game-card {
            flex-direction: column;
            height: auto;

            .card-banner {
              width: 100%;
              height: 200px;
            }
          }
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .game-universe {
    .game-showcase {
      .showcase-header {
        .title-area {
          .main-title {
            font-size: 2rem;
          }
        }
      }

      .games-container {
        &.grid {
          grid-template-columns: 1fr;
        }
      }
    }
  }
}
</style>

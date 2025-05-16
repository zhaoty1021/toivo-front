<template>
  <div class="notes-container">
    <el-card class="notes-card" :class="theme">
      <div class="card-header">
        <SvgIcon name="notes" class="card-icon" />
        <span class="card-title">我的说说</span>
        <el-button class="add-note" @click="showAddDialog" size="small" round>
          <el-icon><Plus /></el-icon> 添加说说
        </el-button>
      </div>

      <div class="notes-content">
        <div
          v-for="(note, index) in notes"
          :key="note.id"
          class="note-item"
          :style="{ '--delay': index * 0.05 + 's' }"
        >
          <div class="note-header">
            <img
              src="http://124.70.85.121:9000/t-blog/avatar/avatar.png"
              class="note-avatar"
              alt="头像"
            />
            <div class="note-user">
              <span class="note-username">萤小宇Tyrone</span>
              <span class="note-date">{{ formatDate(note.date) }}</span>
            </div>
          </div>
          <div class="note-text">{{ note.content }}</div>
          <div class="note-actions">
            <el-button text @click="likeNote(note.id)">
              <el-icon><Star /></el-icon> {{ note.likes }}
            </el-button>
            <el-button text @click="deleteNote(note.id)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
      </div>

      <div class="tech-border"></div>

      <!-- 添加说说对话框 -->
      <el-dialog v-model="dialogVisible" title="添加说说" width="500px">
        <el-input
          v-model="newNoteContent"
          type="textarea"
          :rows="4"
          placeholder="写下此刻的心情..."
          maxlength="200"
          show-word-limit
          class="note-input"
        />
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addNote">发布</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";
import { Plus, Star, Delete } from "@element-plus/icons-vue";
import SvgIcon from "@/components/SvgIcon.vue";

const theme = inject("theme", "dark");

// 模拟说说数据
const notes = ref([
  {
    id: 1,
    username: "技术探索者",
    avatar: "https://via.placeholder.com/40/00f0ff/ffffff?text=头像",
    content: "今天发现了一个超棒的Vue3组件库，准备在项目中试试看！😊",
    date: "2023-11-15T10:30:00",
    likes: 12,
  },
  {
    id: 2,
    username: "技术探索者",
    avatar: "https://via.placeholder.com/40/00f0ff/ffffff?text=头像",
    content: "终于解决了那个困扰我一周的Bug，原来是一个小小的异步问题。",
    date: "2023-11-12T18:45:00",
    likes: 8,
  },
  {
    id: 3,
    username: "技术探索者",
    avatar: "https://via.placeholder.com/40/00f0ff/ffffff?text=头像",
    content: "开始学习Rust，感觉所有权概念好有趣！",
    date: "2023-11-08T14:20:00",
    likes: 5,
  },
  {
    id: 4,
    username: "技术探索者",
    avatar: "https://via.placeholder.com/40/00f0ff/ffffff?text=头像",
    content: "分享了我的开源项目，收到了第一个Star，开心~",
    date: "2023-11-05T09:15:00",
    likes: 15,
  },
  {
    id: 5,
    username: "技术探索者",
    avatar: "https://via.placeholder.com/40/00f0ff/ffffff?text=头像",
    content: "重构了项目中的状态管理，代码清爽多了！",
    date: "2023-11-01T16:50:00",
    likes: 7,
  },
]);

const dialogVisible = ref(false);
const newNoteContent = ref("");

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date
    .toLocaleDateString("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(/\//g, "-");
};

// 点赞说说
const likeNote = (id) => {
  const note = notes.value.find((n) => n.id === id);
  if (note) {
    note.likes += 1;
  }
};

// 删除说说
const deleteNote = (id) => {
  notes.value = notes.value.filter((n) => n.id !== id);
};

// 显示添加对话框
const showAddDialog = () => {
  dialogVisible.value = true;
  newNoteContent.value = "";
};

// 添加新说说
const addNote = () => {
  if (newNoteContent.value.trim()) {
    const newNote = {
      id: Date.now(),
      username: "我",
      avatar: "https://via.placeholder.com/40/00f0ff/ffffff?text=我",
      content: newNoteContent.value,
      date: new Date().toISOString(),
      likes: 0,
    };
    notes.value.unshift(newNote);
    dialogVisible.value = false;
  }
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=ZCOOL+XiaoWei&family=Ma+Shan+Zheng&family=Noto+Sans+SC:wght@400;500;700&display=swap");

.notes-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.notes-card {
  --primary-color: #00f0ff;
  --secondary-color: #ff00f0;
  --accent-color: #00ff9d;
  --bg-color: #0a0a12;
  --text-color: #ffffff;
  --border-color: rgba(0, 240, 255, 0.3);
  --card-bg: #0a0a12;
  --hover-bg: rgba(0, 240, 255, 0.1);
  --glow-effect: 0 0 15px rgba(0, 240, 255, 0.3);
  --note-bg: rgba(0, 0, 0, 0.2);
  --note-paper: linear-gradient(
    to bottom,
    transparent 95%,
    rgba(0, 240, 255, 0.1) 95%
  );
  --note-paper-line: 1.8em;

  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  position: relative;
  margin-top: 70px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--glow-effect);
  }

  &.light {
    --primary-color: #0066cc;
    --secondary-color: #cc00ff;
    --accent-color: #00aa66;
    --bg-color: #f0f2f5;
    --text-color: #333344;
    --border-color: rgba(0, 102, 204, 0.3);
    --card-bg: rgba(255, 255, 255, 0.95);
    --hover-bg: rgba(0, 102, 204, 0.1);
    --glow-effect: 0 0 15px rgba(0, 102, 204, 0.2);
    --note-bg: rgba(255, 255, 255, 0.5);
    --note-paper: linear-gradient(
      to bottom,
      transparent 95%,
      rgba(0, 102, 204, 0.1) 95%
    );
  }

  .card-header {
    display: flex;
    align-items: center;
    padding: 16px 24px;
    border-bottom: 1px solid var(--border-color);

    .card-icon {
      width: 24px;
      height: 24px;
      margin-right: 12px;
      color: var(--primary-color);
      filter: drop-shadow(0 0 5px rgba(0, 240, 255, 0.5));
    }

    .card-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--text-color);
      flex: 1;
    }

    .add-note {
      background: var(--primary-color);
      color: white;
      border: none;
      transition: all 0.3s;

      &:hover {
        background: var(--accent-color);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 240, 255, 0.3);
      }
    }
  }

  .notes-content {
    padding: 16px;

    .note-item {
      background: var(--note-bg);
      background-image: var(--note-paper);
      background-size: 100% var(--note-paper-line);
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 16px;
      border: 1px solid var(--border-color);
      position: relative;
      overflow: hidden;
      animation: fadeInUp 0.5s ease-out forwards;
      animation-delay: var(--delay);
      opacity: 0;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 12px rgba(0, 240, 255, 0.2);
      }

      .note-header {
        display: flex;
        align-items: center;
        margin-bottom: 12px;

        .note-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          margin-right: 12px;
          border: 2px solid var(--primary-color);
        }

        .note-user {
          display: flex;
          flex-direction: column;

          .note-username {
            font-weight: bold;
            color: var(--text-color);
            font-size: 16px;
          }

          .note-date {
            font-size: 12px;
            color: var(--primary-color);
            opacity: 0.8;
            font-family: "Courier New", monospace;
          }
        }
      }

      .note-text {
        font-family: 
    /* 英文手写体 */ "Dancing Script",
          /* 中文手写体 */ "Ma Shan Zheng", "ZCOOL XiaoWei",
          /* 通用无衬线字体 */ "Noto Sans SC", sans-serif;
        font-size: 22px;
        //line-height: 1.6;  /* 更合理的行高 */
        line-height: var(--note-paper-line);
        color: var(--text-color);
        margin-bottom: 12px;
        white-space: pre-wrap;
        padding-left: 52px; /* 头像宽度 + 间距 */
        position: relative;
        min-height: calc(var(--note-paper-line) * 3);
        font-weight: 600; /* 加粗字体 */
        text-shadow: 0.5px 0.5px 1px rgba(0, 0, 0, 0.1); /* 轻微阴影增加立体感 */
        letter-spacing: 0.5px; /* 适当字间距 */
      }

      .note-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding-top: 12px;

        .el-button {
          color: var(--text-color);
          opacity: 0.7;
          transition: all 0.2s;

          &:hover {
            color: var(--primary-color);
            opacity: 1;
            transform: scale(1.1);
          }

          .el-icon {
            margin-right: 4px;
          }
        }
      }

      &::after {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background: var(--primary-color);
        border-radius: 4px 0 0 4px;
      }
    }
  }

  .tech-border {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, var(--primary-color), transparent);
  }

  :deep(.el-dialog) {
    border-radius: 12px;
    overflow: hidden;
    background: var(--card-bg);
    border: 1px solid var(--border-color);

    .el-dialog__header {
      border-bottom: 1px solid var(--border-color);
      margin-right: 0;

      .el-dialog__title {
        color: var(--text-color);
      }
    }

    .el-dialog__body {
      padding: 20px;
    }

    .el-dialog__footer {
      border-top: 1px solid var(--border-color);
    }

    .note-input {
      :deep(.el-textarea__inner) {
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid var(--border-color);
        color: var(--text-color);
        font-family: "Ma Shan Zheng", "ZCOOL KuaiLe", cursive, sans-serif;
        font-size: 16px;
        resize: none;
        line-height: 1.8;
        background-image: linear-gradient(
          to bottom,
          transparent 95%,
          rgba(0, 240, 255, 0.1) 95%
        );
        background-size: 100% 1.8em;

        &::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
      }
    }
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .notes-container {
    padding: 10px;
  }

  .notes-card {
    .card-header {
      padding: 12px 16px;

      .card-title {
        font-size: 18px;
      }
    }

    .notes-content {
      padding: 12px;

      .note-item {
        padding: 16px;

        .note-text {
          font-size: 16px;
          padding-left: 48px;
        }
      }
    }
  }
}
</style>

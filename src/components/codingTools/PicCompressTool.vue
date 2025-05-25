<template>
  <div class="cyber-tool-card" :class="theme">
    <div class="tech-header">
      <h1 class="title">图片压缩</h1>
      <div class="tech-underline"></div>
      <p class="tech-subtitle">QUANTUM IMAGE OPTIMIZER</p>
    </div>

    <div class="image-uploader" @dragover.prevent @drop="handleDrop">
      <div class="upload-area" :class="{ active: isDragging }">
        <svg-icon name="upload" class="upload-icon" />
        <p>拖放图片到此处 或</p>
        <ToolButton @click="triggerFileInput" class="browse-button">
          <template #icon>
            <svg-icon name="folder" />
          </template>
          浏览文件
        </ToolButton>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="handleFileChange"
          class="file-input"
        />
      </div>
    </div>

    <div class="compression-controls" v-if="originalImage">
      <div class="control-group">
        <label>压缩质量</label>
        <div class="slider-container">
          <input
            type="range"
            v-model="compressionQuality"
            min="10"
            max="100"
            step="5"
            class="cyber-slider"
          />
          <span class="slider-value">{{ compressionQuality }}%</span>
        </div>
      </div>

      <div class="control-group">
        <label>输出格式</label>
        <div class="format-options">
          <div
            v-for="format in outputFormats"
            :key="format"
            class="format-option"
            :class="{ active: outputFormat === format }"
            @click="outputFormat = format"
          >
            {{ format.toUpperCase() }}
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <ToolButton @click="compressImage" class="primary">
          <template #icon>
            <svg-icon name="compress" />
          </template>
          开始压缩
        </ToolButton>
        <ToolButton @click="resetAll" class="danger">
          <template #icon>
            <svg-icon name="reset" />
          </template>
          重置
        </ToolButton>
      </div>
    </div>

    <div class="image-preview" v-if="originalImage || compressedImage">
      <div class="preview-column">
        <h4>原始图片</h4>
        <div class="image-container">
          <img :src="originalImage" alt="原始图片" />
          <div class="image-stats" v-if="originalStats">
            <span>{{ originalStats.size }}</span>
            <span>{{ originalStats.dimension }}</span>
          </div>
        </div>
      </div>

      <div class="preview-column" v-if="compressedImage">
        <h4>压缩结果</h4>
        <div class="image-container">
          <img :src="compressedImage" alt="压缩图片" />
          <div class="image-stats">
            <span>{{ compressedStats.size }}</span>
            <span>{{ compressedStats.dimension }}</span>
            <span class="reduction">{{ compressedStats.reduction }}</span>
          </div>
        </div>
        <ToolButton @click="downloadImage" class="download-button">
          <template #icon>
            <svg-icon name="download" />
          </template>
          下载图片
        </ToolButton>
      </div>
    </div>

    <div class="processing-overlay" v-if="isProcessing">
      <div class="processing-content">
        <div class="scanline"></div>
        <svg-icon name="processor" class="processing-icon" />
        <p>努力压缩中...</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import ToolButton from "./ToolButton.vue";
import {
  compressImage as compressImageUtil,
  getImageInfo,
} from "@/utils/imageCompressor";

const theme = inject("theme", "dark");

const fileInput = ref(null);
const originalImage = ref(null);
const compressedImage = ref(null);
const compressionQuality = ref(70);
const outputFormat = ref("jpeg");
const isDragging = ref(false);
const isProcessing = ref(false);
const progress = ref(0);
const originalStats = ref(null);
const compressedStats = ref(null);

const outputFormats = ["jpeg", "png", "webp", "avif"];

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleDrop = (e) => {
  isDragging.value = false;
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) {
    processImageFile(file);
  }
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    processImageFile(file);
  }
};

const processImageFile = async (file) => {
  try {
    // 获取图片信息
    originalStats.value = await getImageInfo(file);

    // 显示原始图片
    originalImage.value = URL.createObjectURL(file);

    // 可以在这里直接压缩图片
    // const compressedBlob = await compressImage(file, {
    //   quality: compressionQuality.value / 100,
    //   outputType: outputFormat.value
    // });
    // compressedImage.value = URL.createObjectURL(compressedBlob);
  } catch (error) {
    console.error("图片处理失败:", error);
  }
};

// 组件方法
const compressImage = async () => {
  if (!originalImage.value || isProcessing.value) return;

  isProcessing.value = true;

  try {
    const response = await fetch(originalImage.value);
    const blob = await response.blob();

    // 使用重命名后的工具函数
    const compressedBlob = await compressImageUtil(blob, {
      quality: compressionQuality.value / 100,
      outputType: outputFormat.value,
    });

    compressedImage.value = URL.createObjectURL(compressedBlob);
    compressedStats.value = {
      size: formatFileSize(compressedBlob.size),
      dimension: originalStats.value.dimension,
      reduction: `减少 ${Math.round(
        100 - (compressedBlob.size / blob.size) * 100
      )}%`,
    };
  } catch (error) {
    console.error("压缩失败:", error);
  } finally {
    isProcessing.value = false;
  }
};

const simulateCompressionResult = () => {
  setTimeout(() => {
    // 这里应该是实际的压缩逻辑
    // 模拟压缩结果
    compressedImage.value = originalImage.value; // 实际项目中这里应该是压缩后的图片

    // 模拟压缩统计信息
    const originalSize = Math.floor(Math.random() * 2000) + 1000; // 模拟原始大小
    const compressedSize = Math.floor(
      originalSize * (compressionQuality.value / 100)
    );

    compressedStats.value = {
      size: formatFileSize(compressedSize * 1024),
      dimension: originalStats.value.dimension,
      reduction: `减少 ${100 - compressionQuality.value}%`,
    };

    isProcessing.value = false;
    progress.value = 0;
  }, 500);
};

const downloadImage = () => {
  if (!compressedImage.value) return;

  const link = document.createElement("a");
  link.href = compressedImage.value;
  link.download = `compressed.${outputFormat.value}`;
  link.click();
};

const resetAll = () => {
  originalImage.value = null;
  compressedImage.value = null;
  originalStats.value = null;
  compressedStats.value = null;
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
</script>

<style lang="scss" scoped>
.cyber-tool-card {
  // 默认亮色主题变量
  --primary-color: #0066cc;
  --secondary-color: #0099ff;
  --accent-color: #00cc99;
  --danger-color: #ff3d3d;
  --bg-color: #f5f7fa;
  --card-bg: #ffffff;
  --text-color: #333344;
  --border-color: rgba(0, 102, 204, 0.2);
  --hover-bg: rgba(0, 102, 204, 0.05);
  --active-bg: rgba(0, 102, 204, 0.1);
  --upload-area-bg: rgba(0, 102, 204, 0.05);

  max-width: 1200px;
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border-color);
  overflow: hidden;
  font-family: "Inter", "PingFang SC", sans-serif;
  position: relative;

  // 暗色主题变量覆盖
  &.dark {
    --primary-color: #00f0ff;
    --secondary-color: #00a8ff;
    --accent-color: #00ffaa;
    --danger-color: #ff5e5e;
    --bg-color: #0a0a12;
    --card-bg: #1a1a2e;
    --text-color: #ffffff;
    --border-color: rgba(0, 240, 255, 0.3);
    --hover-bg: rgba(0, 240, 255, 0.1);
    --active-bg: rgba(0, 240, 255, 0.2);
    --upload-area-bg: rgba(0, 240, 255, 0.05);
  }

  .tech-header {
    text-align: center;
    margin-bottom: 1.5rem;

    .title {
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--primary-color);
      margin-bottom: 0.5rem;
      text-shadow: 0 0 10px rgba(var(--primary-color), 0.3);
    }

    .tech-underline {
      height: 2px;
      background: linear-gradient(
        90deg,
        transparent,
        var(--primary-color),
        transparent
      );
      margin: 0.5rem auto;
      width: 80px;
    }

    .tech-subtitle {
      color: var(--text-color);
      opacity: 0.7;
      font-size: 0.9rem;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
  }

  .image-uploader {
    margin-bottom: 2rem;
    border: 2px dashed var(--border-color);
    border-radius: 10px;
    transition: all 0.3s ease;
    background: var(--upload-area-bg);

    &:hover {
      border-color: var(--primary-color);
      box-shadow: 0 0 15px rgba(var(--primary-color), 0.2);
    }

    .upload-area {
      padding: 2rem;
      text-align: center;
      transition: all 0.3s ease;

      &.active {
        background: var(--hover-bg);
      }

      .upload-icon {
        width: 48px;
        height: 48px;
        margin-bottom: 1rem;
        color: var(--primary-color);
        opacity: 0.7;
      }

      p {
        color: var(--text-color);
        margin-bottom: 1rem;
      }

      .browse-button {
        margin: 0 auto;
      }
    }

    .file-input {
      display: none;
    }
  }

  .compression-controls {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: var(--bg-color);
    border-radius: 10px;
    border: 1px solid var(--border-color);

    .control-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--primary-color);
        font-weight: 600;
      }

      .slider-container {
        display: flex;
        align-items: center;
        gap: 1rem;

        .cyber-slider {
          flex: 1;
          -webkit-appearance: none;
          height: 6px;
          background: var(--border-color);
          border-radius: 3px;
          outline: none;

          &::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: var(--primary-color);
            cursor: pointer;
            box-shadow: 0 0 8px var(--primary-color);
          }
        }

        .slider-value {
          font-family: "Fira Code", monospace;
          color: var(--text-color);
          min-width: 50px;
          text-align: right;
        }
      }

      .format-options {
        display: flex;
        gap: 0.8rem;
        flex-wrap: wrap;

        .format-option {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          color: var(--text-color);
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.9rem;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
          }

          &.active {
            background: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
          }
        }
      }
    }

    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 2rem;

      .primary {
        --button-color: var(--primary-color);
      }

      .danger {
        --button-color: var(--danger-color);
      }
    }
  }

  .image-preview {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-top: 2rem;

    .preview-column {
      h4 {
        color: var(--primary-color);
        margin-bottom: 1rem;
        text-shadow: 0 0 6px rgba(var(--primary-color), 0.2);
      }

      .image-container {
        position: relative;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid var(--border-color);
        background: var(--bg-color);

        img {
          display: block;
          width: 100%;
          height: auto;
          max-height: 300px;
          object-fit: contain;
        }

        .image-stats {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.7);
          padding: 0.8rem;
          display: flex;
          justify-content: space-between;
          color: white;
          font-size: 0.8rem;

          .reduction {
            color: #00ff88;
            font-weight: bold;
          }
        }
      }

      .download-button {
        margin-top: 1rem;
        width: 100%;
      }
    }
  }

  .processing-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    backdrop-filter: blur(5px);

    .processing-content {
      text-align: center;
      position: relative;
      overflow: hidden;
      padding: 2rem;
      max-width: 300px;
      background: var(--card-bg);
      border-radius: 12px;
      border: 1px solid var(--primary-color);
      box-shadow: 0 0 30px var(--primary-color);

      .scanline {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          to bottom,
          transparent 95%,
          var(--primary-color) 96%,
          transparent 97%
        );
        background-size: 100% 10px;
        animation: scan 3s linear infinite;
        opacity: 0.3;
      }

      .processing-icon {
        width: 64px;
        height: 64px;
        color: var(--primary-color);
        margin-bottom: 1rem;
        animation: pulse 1.5s infinite;
      }

      p {
        color: var(--text-color);
        margin-bottom: 1.5rem;
      }

      .progress-bar {
        height: 6px;
        background: var(--border-color);
        border-radius: 3px;
        overflow: hidden;

        .progress-fill {
          height: 100%;
          background: var(--primary-color);
          transition: width 0.3s ease;
        }
      }
    }
  }

  @media (max-width: 768px) {
    .image-preview {
      grid-template-columns: 1fr;
    }

    .compression-controls {
      padding: 1rem;
    }
  }
}

@keyframes scan {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}
</style>

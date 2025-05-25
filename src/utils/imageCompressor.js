// utils/imageCompressor.js
import UPNG from 'upng-js';
import { encode } from 'image-conversion';

/**
 * 图片压缩工具（支持多种格式优化）
 * @param {File|Blob} file - 图片文件
 * @param {Object} options - 压缩选项
 * @param {number} [options.quality=0.7] - 压缩质量 (0-1)
 * @param {string} [options.outputType='webp'] - 输出类型 (jpeg/png/webp/avif)
 * @param {number} [options.maxWidth=1920] - 最大宽度
 * @param {number} [options.maxHeight=1080] - 最大高度
 * @returns {Promise<Blob>} - 返回压缩后的Blob对象
 */
export async function compressImage(file, options = {}) {
  const {
    quality = 0.7,
    outputType = 'webp', // 默认使用WebP
    maxWidth = 1920,
    maxHeight = 1080
  } = options;

  // 验证文件类型
  if (!file.type.match(/image.*/)) {
    throw new Error('请选择有效的图片文件');
  }

  // 加载图片并获取原始尺寸
  const image = await loadImage(file);
  const { width, height } = calculateSize(image, maxWidth, maxHeight);

  // 根据格式选择压缩方案
  switch (outputType.toLowerCase()) {
    case 'png':
      return compressPNG(image, width, height, quality);
    case 'webp':
      return compressWebP(image, width, height, quality);
    case 'avif':
      return compressAVIF(image, width, height, quality);
    case 'jpeg':
    case 'jpg':
      return compressJPEG(image, width, height, quality);
    default:
      throw new Error(`不支持的输出格式: ${outputType}`);
  }
}

// ================== 格式专用压缩方法 ==================

/**
 * PNG压缩（使用UPNG.js优化）
 */
async function compressPNG(image, width, height, quality) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, width, height);

  // 根据质量调整颜色深度
  const colors = Math.min(
    256,
    Math.max(2, Math.floor(quality * 256)) // 2-256色
  );

  try {
    const imageData = ctx.getImageData(0, 0, width, height);
    const compressed = UPNG.encode(
      [imageData.data.buffer],
      width,
      height,
      colors,
      0 // 无损压缩
    );
    return new Blob([compressed], { type: 'image/png' });
  } catch (error) {
    // 回退到Canvas原生压缩
    return new Promise(resolve => {
      canvas.toBlob(
        blob => resolve(blob || new Blob()),
        'image/png',
        0.9 // 固定质量
      );
    });
  }
}

/**
 * WebP压缩（使用image-conversion库）
 */
async function compressWebP(image, width, height, quality) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, width, height);

  try {
    // 使用更专业的WebP编码库
    return await encode(canvas, {
      quality: Math.max(0.1, quality), // 防止0质量
      type: 'image/webp',
      width,
      height
    });
  } catch (error) {
    // 回退到Canvas原生压缩
    return new Promise(resolve => {
      canvas.toBlob(
        blob => resolve(blob || new Blob()),
        'image/webp',
        quality
      );
    });
  }
}

/**
 * AVIF压缩（现代格式）
 */
async function compressAVIF(image, width, height, quality) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, width, height);

  if (!('avif' in CanvasRenderingContext2D.prototype)) {
    console.warn('浏览器不支持AVIF，将回退到WebP');
    return compressWebP(image, width, height, quality);
  }

  try {
    return await new Promise(resolve => {
      canvas.toBlob(
        blob => resolve(blob || new Blob()),
        'image/avif',
        { quality: Math.max(0.5, quality) } // AVIF需要较高基础质量
      );
    });
  } catch (error) {
    return compressWebP(image, width, height, quality);
  }
}

/**
 * JPEG压缩（优化实现）
 */
async function compressJPEG(image, width, height, quality) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  // 使用高质量绘制
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(image, 0, 0, width, height);

  // 渐进式JPEG编码
  return new Promise(resolve => {
    canvas.toBlob(
      blob => resolve(blob || new Blob()),
      'image/jpeg',
      {
        quality: Math.max(0.1, quality), // 最低10%质量
        mozJPEG: true,  // Firefox优化
        progressive: true // 渐进式加载
      }
    );
  });
}

// ================== 公用工具方法 ==================

async function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('图片加载失败'));
    };
    
    img.src = url;
  });
}

function calculateSize(image, maxWidth, maxHeight) {
  let width = image.width;
  let height = image.height;

  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(
      maxWidth / width,
      maxHeight / height
    );
    width = Math.floor(width * ratio);
    height = Math.floor(height * ratio);
  }

  return { width, height };
}

export async function getImageInfo(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        size: formatFileSize(file.size),
        dimension: `${img.width}×${img.height}px`,
        type: file.type
      });
    };
    
    img.src = url;
  });
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
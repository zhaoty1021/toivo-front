<template>
    <div class="floating-action-bar" :style="{ left: left }">
        <el-tooltip
            class="item"
            effect="dark"
            content="点赞"
            placement="top-start"
        >
            <div class="action-item" @click="$emit('toggle-like')">
                <el-badge :value="likeNum || 0" class="item">
                    <div class="action-button">
                        <i
                            class="fas fa-thumbs-up"
                            :class="{ active: isLike }"
                        ></i>
                    </div>
                </el-badge>
            </div>
        </el-tooltip>
        <el-tooltip
            class="item"
            effect="dark"
            content="收藏"
            placement="top-start"
        >
            <div class="action-item" @click="$emit('toggle-favorite')">
                <el-badge :value="favoriteNum || 0" class="item">
                    <div class="action-button">
                        <i
                            class="fas fa-star"
                            :class="{ active: isFavorite }"
                        ></i>
                    </div>
                </el-badge>
            </div>
        </el-tooltip>
        <el-tooltip
            class="item"
            effect="dark"
            content="沉浸式浏览"
            placement="top-start"
        >
            <div class="action-item" @click="$emit('toggle-sidebar')">
                <div class="action-button">
                    <i class="fas fa-expand"></i>
                </div>
            </div>
        </el-tooltip>
        <div class="action-item reward-item">
            <div class="action-button">
                <i class="fas fa-yen-sign"></i>
            </div>
            <div class="reward-popup">
                <div class="reward-content">
                    <img :src="weixinPayUrl" alt="微信打赏" class="reward-qr" />
                    <img :src="aliPayUrl" alt="支付宝打赏" class="reward-qr" />
                </div>
                <div class="reward-text">扫一扫，请我喝杯咖啡</div>
            </div>
        </div>
        <el-tooltip
            class="item"
            effect="dark"
            content="评论"
            placement="top-start"
        >
            <div class="action-item" @click="$emit('scroll-to-comments')">
                <el-badge :value="commentNum || 0" class="item">
                    <div class="action-button">
                        <i class="fas fa-comment"></i>
                    </div>
                </el-badge>
            </div>
        </el-tooltip>
    </div>
</template>
  
  <script>
export default {
    name: 'FloatingActionBar',
    props: {
        left: {
            type: String,
            default: '0px'
        },
        likeNum: {
            type: Number,
            default: 0
        },
        isLike: {
            type: Boolean,
            default: false
        },
        favoriteNum: {
            type: Number,
            default: 0
        },
        isFavorite: {
            type: Boolean,
            default: false
        },
        commentNum: {
            type: Number,
            default: 0
        },
        weixinPayUrl: {
            type: String,
            default: ''
        },
        aliPayUrl: {
            type: String,
            default: ''
        }
    }
}
</script>
  
  <style lang="scss" scoped>
.floating-action-bar {
    position: fixed;
    top: 40%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 12px;
    border-radius: 12px;
    z-index: 1000;
    transition: left 0.3s ease;

    @media (max-width: 1024px) {
        display: none;
    }

    .action-item {
        cursor: pointer;

        .action-button {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: #fff;
            background: var(--card-bg);
            transition: all 0.3s ease;

            i {
                font-size: 1.2em;
                color: #666;
                color: var(--text-secondary);
                transition: all 0.3s ease;

                &.active {
                    color: #007aff;
                }
            }
        }

        &:hover {
            .action-button {
                background: rgba(#007aff, 0.1);
                transform: translateY(-2px);

                i {
                    color: #007aff;
                    transform: scale(1.1);
                }
            }
        }
    }

    .reward-item {
        position: relative;

        .reward-popup {
            position: absolute;
            left: calc(100% + 16px);
            top: 50%;
            transform: translateY(-50%);
            background: #fff;
            background: var(--card-bg);
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            pointer-events: none;
            width: 510px;

            &::before {
                content: '';
                position: absolute;
                left: -6px;
                top: 50%;
                transform: translateY(-50%) rotate(45deg);
                width: 12px;
                height: 12px;
                background: #fff;
                background: var(--card-bg);
                border-radius: 2px;
            }

            .reward-content {
                display: flex;
                gap: 16px;
                margin-bottom: 12px;

                .reward-qr {
                    width: 250px;
                    height: 250px;
                    border-radius: 6px;
                    object-fit: cover;
                }
            }

            .reward-text {
                text-align: center;
                color: #666;
                color: var(--text-secondary);
                font-size: 0.9em;
            }
        }

        &:hover {
            .reward-popup {
                opacity: 1;
                visibility: visible;
                pointer-events: auto;
                transform: translateY(-50%) translateX(8px);
            }
        }
    }
}
</style>
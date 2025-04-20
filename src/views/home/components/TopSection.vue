<template>
    <div class="main-box">
        <div class="banner-box" @wheel="$emit('wheel', $event)">
            <div class="banner">
                <ImageCard />
            </div>
        </div>
        <div class="top-right">
            <SiteInfo />
        </div>
    </div>
</template>
  
<script setup>
import ImageCard from '@/components/layout/ImageCard.vue'
import SiteInfo from '@/components/authorInfo/index.vue'

defineProps({
    bannerList: Array
})

defineEmits(['wheel'])
</script>
  
<style lang="scss" scoped>
.main-box {
    width: 100%;
    display: flex;
    margin-top: 20px;

    .banner-box {
        height: 350px;
        width: 100%;
        position: relative; // 添加相对定位，确保子元素定位正确

        @media screen and (max-width: 1118px) {
            width: 100%;
        }

        .banner {
            height: 350px;
            border-radius: 5px;
            position: relative; // 添加相对定位
            z-index: 1; // 确保层级正确

            // 注释掉或修改这个伪元素，它可能会遮挡点击
            &::before {
                content: '';
                position: absolute;
                top: 95px;
                left: 0;
                width: 100%;
                height: 200px;
                z-index: -1; // 将其改为负值，确保不会遮挡内容
                pointer-events: none; // 确保不会阻止点击事件
            }

            // 确保 ImageCard 组件占满整个容器
            :deep(.carousel-container) {
                width: 100%;
                height: 100%;
            }
        }
    }

    .top-right {
        display: inline-block;
        width: 30%;
        height: 420px;
        margin-left: 20px;

        .soft {
            margin-top: 20px;
            background-color: #007aff;
            overflow: hidden;
            height: 125px;
            position: relative;
            z-index: 1; // 确保层级正确

            &:hover .overlay {
                opacity: 0;
            }

            .overlay {
                background: rgba(0, 0, 0, 0.3);
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                opacity: 1;
                width: 100%;
                height: 100%;
                transition: all 0.5s;
                pointer-events: none; // 确保遮罩层不会阻止点击
            }

            a {
                display: inline-block;
                width: 100%;
                text-decoration: none;
                overflow: hidden;
                position: relative; // 确保 a 标签内的元素定位正确
                z-index: 1;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .soft-title,
                .soft-info {
                    display: block;
                    padding: 5px;
                    text-align: center;
                    background: rgba(0, 0, 0, 0.7);
                    color: #fff;
                    z-index: 2; // 确保文字层在图片之上
                }

                .soft-title {
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                }

                .soft-info {
                    position: absolute;
                    top: 5px;
                    left: 5px;
                    font-size: 0.8rem;
                }
            }
        }

        ::v-deep(.el-image) {
            width: 100%;
            height: 47%;

            &:last-child {
                margin-top: 20px;
            }
        }

        ::v-deep(.wh_content_all) {
            background-color: var(--theme-color);
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
        }
    }
}

// 确保轮播图中的点击区域不被遮挡
:deep(.carousel-container) {
    position: relative;
    z-index: 1;

    .n-carousel__slide {
        pointer-events: auto;
    }

    .n-carousel__dots {
        z-index: 10;
    }

    .n-carousel__arrow {
        z-index: 10;
    }
}
</style>
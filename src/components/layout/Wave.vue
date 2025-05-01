<script setup lang="ts">
import { inject } from 'vue'

const theme = inject('theme')
</script>

<template>
    <div class="header" :class="theme">
        <div>
            <svg
                class="waves"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 24 150 28"
                preserveAspectRatio="none"
                shape-rendering="auto"
            >
                <defs>
                    <path
                        id="gentle-wave"
                        d="M -160 44 c 30 0 58 -18 88 -18 s 58 18 88 18 s 58 -18 88 -18 s 58 18 88 18 v 44 h -352 Z"
                    />
                </defs>
                <g class="parallax">
                    <use xlink:href="#gentle-wave" x="48" y="0" />
                    <use xlink:href="#gentle-wave" x="48" y="3" />
                    <use xlink:href="#gentle-wave" x="48" y="5" />
                    <use xlink:href="#gentle-wave" x="48" y="7" />
                </g>
            </svg>
        </div>
    </div>
</template>

<style scoped lang="scss">
.header {
    --primary-color: #00f0ff;
    --secondary-color: #ff00f0;
    --accent-color: #00ff9d;
    --wave-color: #1a1a2e;
    --wave-opacity-light: 0.7;
    --wave-opacity-dark: 0.5;

    position: absolute;
    left: 0;
    bottom: -11px;
    width: 100%;
    z-index: 5;
    transition: all 0.3s ease;

    &.light {
        --primary-color: #0066cc;
        --secondary-color: #cc00ff;
        --accent-color: #00aa66;
        --wave-color: #f5eed3;
    }
}

.waves {
    position: relative;
    width: 100%;
    height: 15vh;
    margin-bottom: -7px;
    min-height: 100px;
    max-height: 150px;

    use {
        fill: var(--wave-color);
        animation: move-forever 30s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
    }

    use:nth-child(1) {
        animation-delay: -2s;
        animation-duration: 7s;
        opacity: var(--wave-opacity-dark);
    }

    use:nth-child(2) {
        animation-delay: -3s;
        animation-duration: 10s;
        opacity: var(--wave-opacity-dark);
    }

    use:nth-child(3) {
        animation-delay: -4s;
        animation-duration: 13s;
        opacity: var(--wave-opacity-light);
    }

    use:nth-child(4) {
        animation-delay: -5s;
        animation-duration: 20s;
        opacity: var(--wave-opacity-light);
    }
}

@keyframes move-forever {
    0% {
        transform: translate3d(-90px, 0, 0);
    }
    100% {
        transform: translate3d(85px, 0, 0);
    }
}

/* 响应式调整 */
@media (max-width: 768px) {
    .waves {
        height: 10vh;
        min-height: 80px;
    }
}
</style>
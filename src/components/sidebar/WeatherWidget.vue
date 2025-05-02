<template>
    <el-card class="weather-card" :class="theme">
        <div class="card-header">
            <span class="card-title">
                <svg-icon name="weather" class="icon" />
                {{ cityName || '当前位置' }}天气
            </span>
            <el-tooltip content="刷新位置" placement="top">
                <el-icon class="refresh" @click="refreshLocation">
                    <svg-icon name="refresh" />
                </el-icon>
            </el-tooltip>
        </div>
        <div class="weather-content">
            <div v-if="loading" class="loading">
                <svg-icon name="loading" class="spin-icon" />
                <span>获取位置中...</span>
            </div>
            <div v-else-if="weatherData" class="weather-info">
                <div class="current-weather">
                    <div class="temp-section">
                        <span class="temp">{{ weatherData.temperature }}°</span>
                        <div class="meta">
                            <span class="weather">{{
                                weatherData.weather
                            }}</span>
                            <span class="range">{{
                                weatherData.tempRange
                            }}</span>
                        </div>
                    </div>
                    <img
                        :src="weatherIcon(weatherData.weather)"
                        :alt="weatherData.weather"
                        class="weather-icon"
                    />
                </div>
                <div class="weather-details">
                    <div class="detail-card">
                        <div class="detail-icon">
                            <svg-icon name="humidity" />
                        </div>
                        <div class="detail-text">
                            <span class="label">湿度</span>
                            <span class="value"
                                >{{ weatherData.humidity }}%</span
                            >
                        </div>
                    </div>
                    <div class="detail-card">
                        <div class="detail-icon">
                            <svg-icon name="wind" />
                        </div>
                        <div class="detail-text">
                            <span class="label">风力</span>
                            <span class="value"
                                >{{ weatherData.windPower }}
                                {{ weatherData.windDirection }}</span
                            >
                        </div>
                    </div>
                    
                </div>
            </div>
            <div v-else class="error-message">
                <svg-icon name="error" class="error-icon" />
                <span>{{ errorMessage || '天气数据加载失败' }}</span>
                <el-button class="retry-btn" @click="refreshLocation"
                    >重试</el-button
                >
            </div>
        </div>
    </el-card>
</template>
  
  <script setup>
import { inject, ref, onMounted } from 'vue'

const theme = inject('theme')
const weatherData = ref(null)
const loading = ref(true)
const cityName = ref('')
const errorMessage = ref('')
const cityAdcode = ref('')

// 天气图标映射表
const weatherIcons = {
    晴: 'sunny',
    多云: 'cloudy',
    阴: 'overcast',
    小雨: 'light-rain',
    中雨: 'moderate-rain',
    大雨: 'heavy-rain',
    暴雨: 'storm',
    雷阵雨: 'thunderstorm',
    雪: 'snow',
    雾: 'fog'
}

const weatherIcon = (weather) => {
    const icon = weatherIcons[weather] || 'unknown'
    return new URL(`/src/assets/weather-icons/${icon}.svg`, import.meta.url)
        .href
}

// 获取IP定位 - 保持原有高德API逻辑
const getIPLocation = async () => {
    try {
        const apiKey = 'bb056b24d490f690d9f493eb6d7e85ad'
        const response = await fetch(
            `https://restapi.amap.com/v3/ip?key=${apiKey}`
        )
        const data = await response.json()

        if (data.status === '1') {
            cityName.value = data.city
            cityAdcode.value = data.adcode
            return data.adcode
        }
        throw new Error(data.info || '定位失败')
    } catch (error) {
        errorMessage.value = error.message
        return null
    }
}

// 获取天气数据 - 保持原有高德API逻辑
const getWeatherData = async (adcode) => {
    try {
        const apiKey = 'bb056b24d490f690d9f493eb6d7e85ad'
        const response = await fetch(
            `https://restapi.amap.com/v3/weather/weatherInfo?key=${apiKey}&city=${adcode}&extensions=base`
        )
        const data = await response.json()

        if (data.status === '1' && data.lives?.length) {
            const live = data.lives[0]
            return {
                city: live.city,
                weather: live.weather,
                temperature: live.temperature,
                humidity: live.humidity,
                windDirection: live.winddirection,
                windPower: live.windpower,
                tempRange: `${live.temperature_float - 2}° ~ ${
                    parseInt(live.temperature_float) + 3
                }°`,
                reportTime: live.reporttime
            }
        }
        throw new Error(data.info || '天气数据获取失败')
    } catch (error) {
        errorMessage.value = error.message
        return null
    }
}

// 刷新位置 - 保持原有逻辑
const refreshLocation = async () => {
    try {
        loading.value = true
        errorMessage.value = ''
        const adcode = await getIPLocation()
        if (adcode) {
            weatherData.value = await getWeatherData(adcode)
        }
    } catch (error) {
        console.error('刷新失败:', error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    refreshLocation()
})
</script>
  
  <style lang="scss" scoped>
.weather-card {
    --primary-color: #00f0ff;
    --secondary-color: #ff00f0;
    --accent-color: #00ff9d;
    --bg-color: #0a0a12;
    --text-color: #ffffff;
    --border-color: rgba(0, 240, 255, 0.3);
    --card-bg: #0a0a12;
    --hover-bg: rgba(0, 240, 255, 0.1);
    --detail-bg: rgba(0, 240, 255, 0.05);
    --glow-effect: 0 0 15px rgba(0, 240, 255, 0.3);

    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    margin-bottom: 20px;
    width: 100%;

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
        --detail-bg: rgba(0, 102, 204, 0.05);
        --glow-effect: 0 0 15px rgba(0, 102, 204, 0.2);
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid var(--border-color);
        position: relative;

        .card-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-color);
            display: flex;
            align-items: center;

            .icon {
                width: 20px;
                height: 20px;
                margin-right: 10px;
                color: var(--primary-color);
                filter: drop-shadow(0 0 5px rgba(0, 240, 255, 0.5));
            }
        }

        .refresh {
            cursor: pointer;
            color: var(--text-color);
            transition: all 0.3s;
            width: 20px;
            height: 20px;

            &:hover {
                color: var(--primary-color);
                transform: rotate(180deg);
            }
        }
    }

    .weather-content {
        padding: 20px;

        .loading {
            height: 220px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;

            .spin-icon {
                width: 28px;
                height: 28px;
                animation: spin 1s linear infinite;
                color: var(--primary-color);
            }

            span {
                color: var(--text-color);
                font-size: 14px;
            }
        }

        .error-message {
            height: 220px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;

            .error-icon {
                width: 36px;
                height: 36px;
                color: #ff4d4f;
            }

            span {
                color: var(--text-color);
                font-size: 14px;
            }

            .retry-btn {
                margin-top: 12px;
                padding: 6px 16px;
                background: var(--hover-bg);
                color: var(--primary-color);
                border-color: var(--primary-color);
                font-weight: 500;
                transition: all 0.3s;

                &:hover {
                    background: var(--primary-color);
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 240, 255, 0.3);
                }
            }
        }

        .weather-info {
            .current-weather {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;

                .temp-section {
                    .temp {
                        font-size: 42px;
                        font-weight: 700;
                        color: var(--text-color);
                        line-height: 1;
                        position: relative;

                        &::after {
                            content: '°C';
                            position: absolute;
                            top: 5px;
                            right: -24px;
                            font-size: 16px;
                            font-weight: normal;
                        }
                    }

                    .meta {
                        display: flex;
                        flex-direction: column;
                        margin-top: 8px;

                        .weather {
                            font-size: 16px;
                            font-weight: 500;
                            color: var(--text-color);
                        }

                        .range {
                            font-size: 14px;
                            color: var(--text-color);
                            opacity: 0.8;
                        }
                    }
                }

                .weather-icon {
                    width: 64px;
                    height: 64px;
                    filter: drop-shadow(0 0 8px rgba(0, 240, 255, 0.5));
                }
            }

            .weather-details {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 16px;

                .detail-card {
                    background: var(--detail-bg);
                    border-radius: 12px;
                    padding: 12px;
                    display: flex;
                    align-items: center;
                    transition: all 0.3s;
                    border: 1px solid var(--border-color);
                    backdrop-filter: blur(5px);

                    &:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 4px 12px rgba(0, 240, 255, 0.2);
                    }

                    .detail-icon {
                        width: 36px;
                        height: 36px;
                        background: rgba(0, 240, 255, 0.1);
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 12px;

                        svg {
                            width: 20px;
                            height: 20px;
                            color: var(--primary-color);
                        }
                    }

                    .detail-text {
                        display: flex;
                        flex-direction: column;

                        .label {
                            font-size: 12px;
                            color: var(--text-color);
                            opacity: 0.7;
                            margin-bottom: 2px;
                        }

                        .value {
                            font-size: 14px;
                            font-weight: 500;
                            color: var(--text-color);
                        }
                    }
                }
            }
        }
    }
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
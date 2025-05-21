// src/store/likeMusicListStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getLikeList, getMusicUrl, getLyric, getSongDetail } from '@/api/music'

export const useLikeMusicListStore = defineStore('likeMusicList', () => {
  // 状态
  const likeList = ref([]) // 喜欢的音乐列表
  const loading = ref(false) // 加载状态
  const error = ref(null) // 错误信息

  // 获取喜欢的音乐列表（包括URL和歌词）
  const fetchLikeMusicList = async () => {
    loading.value = true
    error.value = null
    
    try {
      // 1. 获取喜欢的音乐ID列表
    const likeListResponse = await getLikeList()
        // const likeListResponse = {
        //   code: 200,
          
        //   ids: [1365543521, 2161527760] // 模拟数据
          
        // }
      const ids = likeListResponse.ids || []
      
      if (ids.length === 0) {
        likeList.value = []
        return
      }
      
      // 2. 获取音乐URL
      const idString = ids.join(',')
        const urlResponse = await getMusicUrl(idString)
        
      
      // 3. 构建基本音乐列表
      const musicList = ids.map(id => {
        const urlInfo = urlResponse.data.find(item => item.id === id)
        return {
            id: id,
            name: '',
            artist: '',
            album: {},
            cover: '',
            duration: '',
            url: urlInfo?.url || '',
            liked: true,
            category: "like",
        }
      })
        const songDetailResponse = await getSongDetail(idString)
        const songDetails = songDetailResponse.songs || []
        // 4. 合并歌曲详情
        musicList.forEach(music => {
          const detail = songDetails.find(item => item.id === music.id)
          if (detail) {
            music.name = detail.name || ''
            music.artist = detail.ar[0].name || []
            music.album = detail.al || {}
              music.cover = detail.al.picUrl || ''
              music.duration = detail.dt / 1000 || 0
              
          }
        })
      
      // 4. 并行获取所有歌词
    //   const lyricPromises = musicList.map(music => 
    //     getLyric(music.id).then(res => {
    //       if (res.code === 200) {
    //         return {
    //           ...music,
    //           lyric: res.lrc?.lyric || '',
    //           tlyric: res.tlyric?.lyric || ''
    //         }
    //       }
    //       return {
    //         ...music,
    //         lyric: '',
    //         tlyric: ''
    //       }
    //     }).catch(() => ({
    //       ...music,
    //       lyric: '',
    //       tlyric: ''
    //     }))
    //   )
      console.log('lyricPromises', musicList)
      const completeMusicList = musicList
      
      // 5. 更新状态
      likeList.value = completeMusicList
    } catch (err) {
      console.error('获取喜欢的音乐列表失败:', err)
      error.value = err.message || '获取喜欢的音乐列表失败'
    } finally {
      loading.value = false
    }
  }

  // 检查歌曲是否在喜欢列表中
  const isLiked = (id) => {
    return likeList.value.some(song => song.id === id)
  }

  // 获取单个歌曲的详细信息（包括URL和歌词）
  const getMusicDetail = async (id) => {
    try {
      // 检查是否已经在列表中
      const existing = likeList.value.find(song => song.id === id)
      if (existing) return existing
      
      // 如果不在列表中，单独获取
      const [urlResponse, lyricResponse] = await Promise.all([
        getMusicUrl(id),
        getLyric(id)
      ])
      
      const urlInfo = urlResponse.data.find(item => item.id === id)
      
      return {
        id,
        url: urlInfo?.url || '',
        level: urlInfo?.level || '',
        time: urlInfo?.time || 0,
        lyric: lyricResponse.code === 200 ? lyricResponse.lrc?.lyric || '' : '',
        tlyric: lyricResponse.code === 200 ? lyricResponse.tlyric?.lyric || '' : ''
      }
    } catch (err) {
      console.error('获取音乐详情失败:', err)
      return null
    }
  }

  // 重置状态
  const reset = () => {
    likeList.value = []
    loading.value = false
    error.value = null
  }

  return {
    likeList,
    loading,
    error,
    fetchLikeMusicList,
    isLiked,
    getMusicDetail,
    reset
  }
})
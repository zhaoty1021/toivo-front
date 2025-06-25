import request from '@/utils/request'
export function searchMusicByKeywords(keywords) {
    return request({
        url: '/music/search?keywords=' + keywords,
        method: 'get',
    })
}
export function recommendSongs() {
    return request({
        url: '/music/recommend/songs',
        method: 'get'
    })
}
export function getMusicUrl(idList) {
    return request({
        url: '/music/song/url/v1?level=lossless&id=' + idList,
        method: 'get',
    })
}
export function getLyric(id) {
    return request({
        url: '/music/lyric?id=' + id,
        method: 'get',
    })
}

export function getLikeList() {
    return request({
        url: '/music/likelist',
        method: 'get',
    })
}

export function getSongDetail(idList) {
    return request({
        url: '/music/song/detail?ids=' + idList,
        method: 'get',
    })
}

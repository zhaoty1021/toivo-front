import request from '@/utils/request'
export function searchMusicByKeywords(keywords) {
    return request({
        url: '/search?keywords=' + keywords,
        method: 'get',
    })
}
export function recommendSongs() {
    return request({
        url: '/recommend/songs',
        method: 'get'
    })
}
export function getMusicUrl(idList) {
    return request({
        url: '/song/url/v1?level=lossless&id=' + idList,
        method: 'get',
    })
}
export function getLyric(id) {
    return request({
        url: '/lyric?id=' + id,
        method: 'get',
    })
}

export function getLikeList() {
    return request({
        url: '/likelist',
        method: 'get',
    })
}

export function getSongDetail(idList) {
    return request({
        url: '/song/detail?ids=' + idList,
        method: 'get',
    })
}

import request from '@/utils/request'

// 任务列表
export function shortUrlQuery(data) {
  return request({
    url: '/api/ShortUrl/query',
    method: 'post',
    data
  })
}
// 新增任务
export function shortUrlAdd(data) {
  return request({
    url: '/api/ShortUrl/add',
    method: 'post',
    data
  })
}

// 查询详情
export function shortUrlInfo(data) {
  return request({
    url: '/api/ShortUrl/info',
    method: 'post',
    data
  })
}

// 修改
export function shortUrlModifyShortUrl(data) {
  return request({
    url: '/api/ShortUrl/modifyShortUrl',
    method: 'post',
    data
  })
}

// 查询短链
export function shortUrlshorturls(shortUrlImportId) {
  return request({
    url: '/api/ShortUrl/shorturls',
    method: 'post',
    params:{
      shortUrlImportId
    }
  })
}

// 查询短链
export function exportShortUrlInfo(id) {
  return request({
    url: '/api/ShortUrl/ExportShortUrlInfo',
    method: 'post',
    params:{
      id
    }
  })
}


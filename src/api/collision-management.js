import request from '@/utils/request'

// 分页查询
export function phoneQuery(data) {
  return request({
    url: '/api/Phone/query',
    method: 'post',
    data
  })
}
// 新增任务
export function phoneAdd(data) {
  return request({
    url: '/api/Phone/add',
    method: 'post',
    data
  })
}

// 查询详情
export function phonePhoneItemQuery(data) {
  return request({
    url: '/api/Phone/phoneItemQuery',
    method: 'post',
    data
  })
}


// 查询短链
export function phoneExport(id) {
  return request({
    url: '/api/Phone/Export',
    method: 'post',
    params:{
      id
    }
  })
}

// 删除
export function phoneDeletet(id) {
  return request({
    url: '/api/Phone/delete',
    method: 'post',
    params:{
      id
    }
  })
}



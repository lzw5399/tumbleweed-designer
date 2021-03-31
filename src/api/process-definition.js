import request from '@/utils/request'

export function getProcessDefinitionList(params) {
  request.defaults.headers['WF-CURRENT-USER'] = '233'
  return request({
    url: '/api/wf/process-definitions',
    method: 'get',
    params
  })
}

export function getProcessDefinition(id) {
  request.defaults.headers['WF-CURRENT-USER'] = '233'
  return request({
    url: '/api/wf/process-definitions/' + id,
    method: 'get'
  })
}

export function createProcessDefinition(data, currentUserId) {
  request.defaults.headers['WF-CURRENT-USER'] = currentUserId
  return request({
    url: '/api/wf/process-definitions',
    method: 'post',
    data
  })
}

export function updateProcessDefinition(data, currentUserId) {
  request.defaults.headers['WF-CURRENT-USER'] = currentUserId
  return request({
    url: '/api/wf/process-definitions',
    method: 'put',
    data
  })
}

export function deleteProcessDefinition(id, currentUserId) {
  request.defaults.headers['WF-CURRENT-USER'] = currentUserId
  return request({
    url: '/api/wf/process-definitions/' + id,
    method: 'delete'
  })
}

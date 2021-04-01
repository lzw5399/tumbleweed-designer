import request from '@/utils/request'

export function getProcessInstanceList(params, currentUserId) {
  request.defaults.headers['WF-CURRENT-USER'] = currentUserId
  return request({
    url: '/api/wf/process-instances',
    method: 'get',
    params
  })
}

export function getProcessInstance(id, currentUserId) {
  request.defaults.headers['WF-CURRENT-USER'] = currentUserId
  return request({
    url: '/api/wf/process-instances/' + id,
    method: 'get'
  })
}

export function createProcessInstance(data, currentUserId) {
  request.defaults.headers['WF-CURRENT-USER'] = currentUserId
  return request({
    url: '/api/wf/process-instances',
    method: 'post',
    data
  })
}

export function updateProcessInstance(data, currentUserId) {
  request.defaults.headers['WF-CURRENT-USER'] = currentUserId
  return request({
    url: '/api/wf/process-instances',
    method: 'put',
    data
  })
}

export function handleProcessInstance(data, currentUserId) {
  request.defaults.headers['WF-CURRENT-USER'] = currentUserId
  return request({
    url: '/api/wf/process-instances/_handle',
    method: 'post',
    data
  })
}

export function denyProcessInstance(data, currentUserId) {
  request.defaults.headers['WF-CURRENT-USER'] = currentUserId
  return request({
    url: '/api/wf/process-instances/_deny',
    method: 'post',
    data
  })
}

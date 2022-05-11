import request, { ResponsePageableData } from '@/libs/request'

// [Demo] 获取用户列表
export const getUserList = (data?) => request<ResponsePageableData>({ url: 'adminapi/User/getUserList', data })

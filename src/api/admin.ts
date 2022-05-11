import request, { ResponsePageableData } from '@/libs/request'
import { getToken } from '@/libs/local-store'
import type { UserInfo } from '@/store/modules/user'
import { ResponseCommonData } from '@/libs/request'

// [Demo] 登陆
export const login = (data: { account: string; pswd: string }) => request({ url: 'adminapi/Admin/login', data })

// [Demo] 获取管理员信息
export const getAdminInfo = (silence = false) =>
	request({ url: 'adminapi/Admin/getAdminInfo', auto_message_when_error: !silence })

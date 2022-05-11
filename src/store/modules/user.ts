import { defineStore } from 'pinia'
import { getAdminInfo } from '@/api/admin'
import { getToken } from '@/libs/local-store'

export type UserInfo = {
	id: number
	name: string
}

export const useUserStore = defineStore('user', {
	state: () => ({
		/** 登录人信息 */
		info: null as null | UserInfo,
	}),
	actions: {
		/** 设置登录人信息 */
		setInfo(info: UserInfo | null) {
			this.info = info
		},
		/** 调用API 更新登录人信息 */
		updateInfo(silence = false) {
			return getAdminInfo(silence).then((res) => {
				this.setInfo(res.data)
				return res.data
			})
		},
		logout() {
			this.setInfo(null)
			getToken(true)
			return Promise.resolve()
		},
	},
})

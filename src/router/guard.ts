import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { getToken } from '@/libs/local-store'
import { useUserStore } from '@/store/modules/user'
import { useMainStateStore } from '@/store/modules/main-state'

/**
 * 全局前置守卫
 */
export const beforeEach = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
	// 验证登录状态
	// 1. 先判断store中是否有用户信息，如果有，表示登陆成功
	// 2. 否则判断是否有token，如果有，调用API检查token并更新用户信息，也证明登陆成功
	// 3. 如果token存在但未能通过API检查有效，或没有token，认为登陆失效
	if (to.meta?.login !== false) {
		const user_store = useUserStore()
		if (user_store.info) {
			return next()
		} else {
			const token = getToken()
			if (token) {
				return user_store
					.updateInfo()
					.then(() => next())
					.catch((e) => {
						getToken(true)
						return next({ name: 'login' })
					})
			} else {
				return next({ name: 'login' })
			}
		}
	}

	next()
}

/**
 * 全局后守卫
 */
export const afterEach = async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
	// 页面标题
	if (typeof to.meta.title == 'string') document.title = to.meta.title

	// 设置面包屑导航
	useMainStateStore().setBreadcrumbByRoute(to)
}

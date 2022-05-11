import { RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import ViewMain from '@/common/views/main.vue'

const routes: RouteRecordRaw[] = [
	{
		path: '/login',
		name: 'login',
		meta: {
			title: '登陆',
			login: false,
		},
		component: () => import(/* webpackChunkName: "common" */ '@/common/views/login.vue'),
		beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
			// 如果已有登录态，不允许进入登录页
			const user_store = useUserStore()
			if (user_store.info) return next(from)
			else {
				return user_store
					.updateInfo(true)
					.then(() => next(from))
					.catch(() => next())
			}
		},
	},
	{
		path: '/control_center',
		alias: '/',
		redirect: { name: 'control_dashboard' },
		meta: { title: '控制中心' },
		component: ViewMain,
		children: [
			{
				path: 'dashboard',
				name: 'control_dashboard',
				meta: {
					title: '控制面板',
				},
				component: () => import(/* webpackChunkName: "control" */ '@/views/control/dashboard.vue'),
			},
		],
	},
	{
		path: '/person',
		redirect: { name: 'user_list' },
		component: ViewMain,
		children: [
			{
				path: 'user_list',
				name: 'person_user_list',
				meta: {
					title: '用户列表',
					breadcrumb: [{ name: '人员管理' }, { name: '用户列表' }],
				},
				component: () => import(/* webpackChunkName: "person" */ '@/views/user/user-list.vue'),
			},
			{
				path: 'admin_list',
				name: 'person_admin_list',
				meta: {
					title: '管理员列表',
					breadcrumb: [{ name: '人员管理' }, { name: '管理员列表' }],
				},
				component: () => import(/* webpackChunkName: "person" */ '@/views/user/admin-list.vue'),
			},
		],
	},
	{
		path: '/order',
		redirect: { name: 'order_list' },
		meta: { title: '订单管理' },
		component: ViewMain,
		children: [
			{
				path: 'list',
				name: 'order_list',
				meta: {
					title: '订单列表',
				},
				component: () => import(/* webpackChunkName: "order" */ '@/views/order/order-list.vue'),
			},
		],
	},

	/** 通配异常页面 */
	{
		path: '/:pathMatch(.*)*',
		name: 'error',
		meta: {
			login: false,
		},
		component: () => import(/* webpackChunkName: "views" */ '@/common/views/error.vue'),
		props: {
			icon: 'warning',
			title: '404 页面找不到啦~',
			description: '生活总归带点荒谬',
		},
	},
]

export default routes

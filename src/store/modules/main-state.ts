import { defineStore } from 'pinia'
import { VNode, h } from 'vue'
import IconFont from '@/components/icon-font'
import { ArrowRight } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'
import { RouteLocationRaw, RouteLocationNormalized } from 'vue-router'

export const useMainStateStore = defineStore('main-state', {
	state: () => ({
		/** 主导航菜单数组 */
		main_menu_list: [
			{
				name: '控制中心',
				icon: () => h(IconFont, { icon: 'icon-kongzhimianban', size: 20 }),
				route: 'control_dashboard',
			},
			{
				name: '人员管理',
				icon: () => h(IconFont, { icon: 'icon-205yonghu_yonghu6', size: 20 }),
				children: [
					{
						name: '用户列表',
						route: 'person_user_list',
					},
					{
						name: '管理员列表',
						route: 'person_admin_list',
					},
				],
			},
			{
				name: '订单管理',
				icon: () => h(IconFont, { icon: 'icon-order', size: 20 }),
				route: 'order_list',
			},
		] as MainMenuItem[],

		/** 面包屑 */
		breadcrumb: {
			separator: undefined as string | undefined,
			separator_icon: (ArrowRight as any).render(),
			list: [
				{
					name: '页面A',
					to: { name: 'control_dashboard' },
				},
				{
					name: '页面B',
				},
			] as BreadcrumbItem[] as BreadcrumbItem[],
		},
	}),
	actions: {
		/** 根据Route自动设置面包屑 */
		setBreadcrumbByRoute(to: RouteLocationNormalized) {
			this.breadcrumb.list = []
			if (typeof to.meta?.breadcrumb == 'undefined' || to.meta?.breadcrumb === true) {
				// 自动设置
				to.matched?.forEach((it, index) => {
					if (it.meta && it.meta.title) {
						this.breadcrumb.list.push({
							name: it.meta.title,
							to: to.matched.length - 1 == index ? undefined : { path: it.path },
						})
					}
				})
			} else if (Array.isArray(to.meta.breadcrumb)) {
				// 手动设置
				this.breadcrumb.list = to.meta.breadcrumb
			}
		},
	},
})
/** 主导航菜单单个元素 */
export type MainMenuItem = {
	/** 名称 */
	name: string | number
	/** 图标 */
	icon?: () => VNode
	/** 子元素，最多允许两级 */
	children: MainMenuItem[]
	/** 是否禁用，仅对第一级菜单起作用 */
	disabled?: boolean
	/**
	 * 路由对象
	 * @description 当传入string类型时，会跳转该路由的name
	 */
	route?: string | RouteLocationRaw
	/** 跳转外部链接 */
	link?: string
	/** 是否打开新窗口 */
	blank?: boolean
}

/** 面包屑单个元素 */
export type BreadcrumbItem = {
	name: string | number
	to?: string | RouteLocationRaw
}

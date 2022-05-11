import 'vue-router'
import type { BreadcrumbItem } from '@/store/modules/main-state'

/**
 * 定义路由元信息类型
 */
declare module 'vue-router' {
	interface RouteMeta {
		/**
		 * 标题
		 * @description 如果设置title，router守卫会据此来设置网页的title，undefined则不处理
		 */
		title?: string | number
		/**
		 * 是否要求登录
		 * @description undefined会被视为true，本参数在router守卫中使用并处理
		 */
		login?: boolean
		/**
		 * 是否自动更新面包屑
		 * @description 设为false关闭面包屑，不设置或true会自动根据route.metch更新面包屑，也可直接使用数组设置
		 */
		breadcrumb?: boolean | BreadcrumbItem[]
	}
}

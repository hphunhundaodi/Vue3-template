import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
	state: () => ({
		/** 应用名称 */
		name: 'V3E项目启动框架',
		/** 应用短名称 */
		sort_name: 'V3E',
		/** 应用版本 */
		version: '1.0.0',
		/** 屏幕尺寸 */
		screen: {
			width: window.innerWidth,
			height: window.innerHeight,
		},
		/** 是否是移动端，不是移动端就是PC端 */
		is_mobile:
			/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(
				navigator.userAgent
			),
	}),
	actions: {
		updateScreen() {
			this.$patch({
				screen: {
					width: window.innerWidth,
					height: window.innerHeight,
				},
			})
		},
	},
})

// 自动监听屏幕尺寸变化
window.addEventListener('resize', () => {
	const appStore = useAppStore()
	appStore.updateScreen()
})

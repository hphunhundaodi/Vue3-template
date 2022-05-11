/// <reference types="vite/client" />

declare module '*.vue' {
	import { DefineComponent } from 'vue'
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
	const component: DefineComponent<{}, {}, any>
	export default component
}

// 定义env中的变量
interface ImportMetaEnv {
	VITE_APP_VERSION: string
	VITE_APP_BUILD_EPOCH: any

	VITE_API_BASE_URL: string
	VITE_STORAGE_PREFIX: string
	VITE_ICONFONT_URL: string
	VITE_AMAP_KEY: string
}

// 定义window上挂载的变量
interface Window {
	CONFIG: any
}

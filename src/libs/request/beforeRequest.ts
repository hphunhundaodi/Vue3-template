import { cloneDeep } from 'lodash'
import { getToken } from '@/libs/local-store/index'
import { RequestConfig } from './index'

export const beforeRequest = async (config: RequestConfig) => {
	// 默认请求方式
	if (!('method' in config)) config.method = 'POST'

	// 处理基础路径
	if (!('baseURL' in config) && config.url && !config.url.startsWith('http'))
		config.baseURL = import.meta.env.VITE_API_BASE_URL

	// 处理参数
	let params = config.data ? (config.data instanceof FormData ? config.data : cloneDeep(config.data)) : {}

	// 挂载token
	if (params instanceof FormData && !params.has('TOKEN')) params.append('TOKEN', getToken())
	else if (!('TOKEN' in params)) params['TOKEN'] = getToken()

	// 设置参数
	if (config.method?.toLowerCase() == 'get') config.params = params
	else config.data = params

	return Promise.resolve(config)
}

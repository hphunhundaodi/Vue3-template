import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { beforeRequest } from './beforeRequest'
import { afterResponse, afterError } from './afterResponse'

/**
 * 请求配置参数
 */
export interface RequestConfig<DataType = any> extends AxiosRequestConfig<DataType> {
	/**
	 * 响应code不为0时抛出 ResponseServiceFailed 异常，
	 * 默认为true
	 */
	throw_service_failed?: boolean
	/**
	 * 异常（网络异常或业务异常被触发）时是否自动显示提示，
	 * 默认为true
	 */
	auto_message_when_error?: boolean
}

/**
 * 通用响应结构体
 */
export interface ResponseCommonData<DataType = any> {
	code: number | string
	msg: string
	data: DataType
}

/**
 * 通用分页响应结构体
 */
export interface ResponsePageableData<T = any> {
	rows: T[]
	total: number
}

/**
 * 响应业务失败
 */
export interface ResponseServiceError<D = any> extends Error {
	code: number | string
	data: D
	config: RequestConfig
	response: AxiosResponse
	isResponseServiceError: boolean
}

/**
 * Http请求
 * 自动挂载token、添加前缀等功能
 * @param config 请求配置，无论什么类型请求，参数都挂在data上就行
 * @returns
 */
const request = <ResponseDataType = any>(config: RequestConfig): Promise<ResponseCommonData<ResponseDataType>> => {
	return beforeRequest(config).then((config) => {
		return axios(config)
			.then((response) => {
				return afterResponse<ResponseDataType>(config, response)
			})
			.catch((error: AxiosError | ResponseServiceError) => {
				return afterError(config, error)
			})
	})
}

export default request

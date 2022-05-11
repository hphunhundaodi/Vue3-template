import { AxiosResponse, AxiosError } from 'axios'
import { RequestConfig, ResponseCommonData, ResponseServiceError } from './index'
import { ElMessage } from 'element-plus'

const showErrorMessage = (msg: string, code?: number | string) => ElMessage.error(`${msg}${code ? `(${code})` : ''}`)

export const afterResponse = async <ResponseDataType = any>(
	config: RequestConfig,
	response?: AxiosResponse
): Promise<ResponseCommonData<ResponseDataType>> => {
	if (config.throw_service_failed !== false && response) {
		// 业务错误，处理自动抛出异常和消息
		if (response.data.code != 0) {
			let error = new Error(response.data.msg) as ResponseServiceError
			error.code = response.data.code
			error.name = 'ResponseServiceError'
			error.config = config
			error.response = response
			error.isResponseServiceError = true
			return Promise.reject(error)
		}
	}
	return Promise.resolve(response?.data)
}

export const afterError = async (config: RequestConfig, error: ResponseServiceError | AxiosError) => {
	if (config.auto_message_when_error !== false) showErrorMessage(error.message, error.code)
	return Promise.reject(error)
}

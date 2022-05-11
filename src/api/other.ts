import request, { ResponsePageableData } from '@/libs/request'

export const getUploadImageUrl = () => import.meta.env.VITE_API_BASE_URL + 'commonapi/Upload/uploadImage'

/** 设置模型字段 */
export const setModelField = (data: {
	/** 模型名 */
	model: string
	/** 主键ID */
	id: number | string
	/** 字段名 */
	field: string
	/** 字段值 */
	value: any
}) => request({ url: 'commonapi/Other/setModelField', data })

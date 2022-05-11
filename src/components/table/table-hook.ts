import { assign, cloneDeep } from 'lodash'
import { ref, reactive } from 'vue'
import { ElMessageBox } from 'element-plus'

/**
 * 创建数据模型表格和表单
 */
export const useTable = <RowDataType extends object, QueryType extends object, StateType extends object>(
	option: OptionType<RowDataType, QueryType, StateType>
) => {
	let query: QueryType & BaseQueryType = assign({}, option.query, {
		index: 1,
		limit: 10,
		search_word: '',
	})

	let state: StateType & {
		/** 加载中 */
		loading: boolean
		/** 总条数 */
		total: number
	} = assign({}, option.state, {
		loading: false,
		total: 0,
	})

	return reactive({
		/** 模型名 */
		name: option.name,
		/** 表格数据 */
		data: option.data ?? ([] as RowDataType[]),
		/** 表格查询参数 */
		query,
		/** 表格状态 */
		state,
		/** 模型表单数据 */
		formdata: cloneDeep(option.formdata) as RowDataType,
		/** 表格获取数据操作 */
		getData(
			/** 是否显示加载中状态 */
			show_loading = true
		): Promise<{
			rows: any[]
			total: number
		}> {
			if (!option.getDataMethod) return Promise.reject('未设置获取数据方法')
			if (this.state.loading) return Promise.reject('正在加载中')

			if (show_loading) this.state.loading = true
			return option
				.getDataMethod<typeof query>(this.query)
				.then((data) => {
					this.state.total = data.total
					this.data = data.rows
					return cloneDeep(data)
				})
				.finally(() => (this.state.loading = false))
		},
		/** 删除单条数据操作 */
		delRow(
			/** 一条模型数据 */
			row: DelApiOption | RowDataType
		) {
			if (!option.delDataMethod) return
			// @ts-ignore ts无法识别row上可能存在name属性
			ElMessageBox.confirm(`确定${row?.name ? `对[${row.name}]` : ''}进行删除操作吗？`, '提示', {
				type: 'warning',
				beforeClose: (action, instance, done) => {
					if (action != 'confirm') return done()
					instance.confirmButtonLoading = true
					// @ts-ignore 上面已经判断过 option.delData 是存在的，但由于这里嵌入在beforeClose里，ts又笨了...
					option
						.delDataMethod({ id: 'id' in row ? row.id : '' })
						.then(() => {
							done()
							this.getData()
						})
						.finally(() => (instance.confirmButtonLoading = false))
				},
			}).catch(() => {})
		},
	})
}

/** 全局基础查询参数 */
export type BaseQueryType = {
	/** 页码 */
	index: number
	/** 每页条数 */
	limit: number
	/** 搜索词 */
	search_word: string
}

/** useTable()的参数类型 */
export interface OptionType<RowDataType extends object, QueryType extends object, StateType extends object> {
	/** 模型名 */
	name: string
	/** 模型表单数据 */
	formdata: RowDataType
	/** 表格初始数据 */
	data?: Array<RowDataType & { [property: string]: any }>
	// 设置为RowDataType并一个任意键名属性，相当于约束了table_data的每个元素，至少是一个 RowDataType ，但也可以有其他任意键
	// 例如有时候在获取数据后想给每条数据增加一些额外属性时，ts无法识别这些属性，但也不会造成访问时报错

	/** 额外表格状态 */
	state?: StateType
	/** 额外查询参数 */
	query?: QueryType
	/** 查询数据方法 */
	getDataMethod?: <QueryType extends object>(
		query: QueryType & BaseQueryType
	) => Promise<{ rows: any[]; total: number }>
	/** 删除一条数据方法 */
	delDataMethod?: (query: RowDataType | { id: number | string }) => Promise<any>
}

/** 删除数据方法的参数类型 */
export interface DelApiOption {
	/** ID */
	id: number | string
	/** 名称 */
	name?: string
}

<template>
	<div class="p-4">
		<TableHead v-model:search-word="table.query.search_word" @search="table.getData()" @refresh="table.getData()">
			<div class="flex-box">
				<el-button type="success" @click="formDialogRef.open()">创建用户</el-button>
			</div>
		</TableHead>

		<el-table
			class="w-full shadow hover:shadow-lg"
			v-loading="table.state.loading"
			border
			size="large"
			:data="table.data"
		>
			<el-table-column prop="id" label="#" width="80" align="center" />
			<el-table-column prop="nick_name" label="昵称" />
			<el-table-column prop="mobile" label="电话" width="180" />
			<el-table-column prop="integral" label="积分" width="100" />
			<el-table-column prop="id" label="操作" width="180">
				<template #default="{ row }">
					<el-button type="primary" @click="formDialogRef?.open(row)">编辑</el-button>
					<el-button type="danger" @click="table.delRow(row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<TablePagination
			:query="table.query"
			:state="table.state"
			@current-change="table.getData()"
			@size-change=";(table.query.index = 1), table.getData()"
		/>

		<FormDialog
			ref="formDialogRef"
			v-model:formdata="table.formdata"
			:name="table.name"
			:onClickSubmit="onEditFormSubmit"
		>
			<el-form ref="formRef" class="pr-8" :model="table.formdata" :rules="form_rules" label-width="80px">
				<el-form-item label="昵称" prop="name">
					<el-input v-model="table.formdata.nick_name" />
				</el-form-item>
				<el-form-item label="电话" prop="mobile">
					<el-input v-model="table.formdata.mobile" type="number" />
				</el-form-item>
				<el-form-item label="积分" prop="integral">
					<el-input-number v-model="table.formdata.integral" />
				</el-form-item>
			</el-form>
		</FormDialog>
	</div>
</template>
<script setup lang="ts">
/**
 * 这是一个数据模型增删改查的Demo
 */

import { ref, reactive } from 'vue'
import { useTable } from '@/components/table/table-hook'
import { FormItemRule } from 'element-plus/lib/components/form/src/form.type'

import { ElMessage } from 'element-plus'
import TableHead from '@/components/table/table-head.vue'
import TablePagination from '@/components/table/table-pagination.vue'
import FormDialog from '@/components/form/form-dialog.vue'

import { getUserList } from '@/api/user'

const table = useTable({
	name: '用户',
	formdata: {
		/** ID */
		id: 0,
		/** 姓名 */
		nick_name: '',
		/** 积分 */
		integral: 0,
		/** 手机号 */
		mobile: '',
	},
	getDataMethod: (query) => getUserList(query).then((res) => ({ rows: res.data.rows, total: res.data.total })),
	delDataMethod: (row) => {
		ElMessage.success('删除成功')
		return Promise.resolve({ msg: '删除成功' })
	},
})
table.getData()

const formDialogRef = ref()
const formRef = ref()

/** 新增或编辑按钮触发 */
const onEditFormSubmit = (formdata: typeof table.formdata) => {
	// 这里接收的 formdata 是经过 formDialogRef 修改后的
	return new Promise((resolve, rejcet) => {
		formRef.value.validate((valid, err) => {
			if (!valid) return rejcet()
			setTimeout(() => {
				resolve(true)
			}, 1000)
		})
	})
}

/** 表单验证规则 */
const form_rules = reactive<Partial<Record<string, FormItemRule | FormItemRule[]>>>({
	nick_name: [
		{ required: true, message: '请填写姓名' },
		{ min: 4, message: '长度必须大于4' },
	],
	integral: [
		{ required: true, message: '请填写积分' },
		{ validator: (rule, val) => val >= 0 && val <= 9999, message: '积分必须在0到9999之间' },
	],
})
</script>

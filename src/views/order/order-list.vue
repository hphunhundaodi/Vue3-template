<template>
	<div class="p-4">
		<el-form ref="formRef" class="pr-8" :model="form.formdata" :rules="form.rules" label-width="80px">
			<el-form-item label="昵称" prop="name">
				<el-input v-model="form.formdata.nick_name" />
			</el-form-item>
			<el-form-item label="电话" prop="mobile">
				<el-input v-model="form.formdata.mobile" type="number" />
			</el-form-item>
			<el-form-item label="积分" prop="integral">
				<el-input-number v-model="form.formdata.integral" />
			</el-form-item>
			<el-form-item label="头像" prop="integral">
				<UploadImage v-model="form.formdata.headimgurl" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary">提交</el-button>
				<el-button type="default" @click="formRef.resetFields()">重置</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import UploadImage from '@/components/form/upload-image.vue'
const form = reactive({
	formdata: {
		nick_name: '张三',
		mobile: '15011112222',
		integral: 10,
		headimgurl: [],
	},
	rules: {},
})

const formRef = ref()
</script>
